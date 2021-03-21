const _ = require('lodash')
const config = require('../../config/env/all')
const mongoose = require('mongoose')
const helper = require('./helper')
const Hashids = require('hashids/cjs')
const hashKey = config.HASH_KEY
const HOST = config.FRONT_HOST
const API_HOST = config.HOST
let locations = []
let places = []



function encodeId(id) {
  const hasids = new Hashids(hashKey)
  return hasids.encode(id)
}

function decodeId(string) {
  const hasids = new Hashids(hashKey)
  return hasids.decode(string)
}

function findPlace(name) {
  const place = _.find(places, place => place.name === name)
  return place
}

function findLocation(type, argument) {
  return _.find(places, place => _.get(place, `${type}`, argument))
}

function toCamelCase(str) {
  if (!str) return null
  return str
    .replace(/\s(.)/g, function($1) {
      return $1.toUpperCase()
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase()
    })
}

function getIcon(content) {
  const camelCase = toCamelCase(content)
  const data = {
    duration: 'icon-clock-o',
    liveTourGuide: 'icon-user',
    skipTheTicketLine: 'icon-pitch',
    printedOrMobileVoucherAccepted: 'icon-bookmark-o',
    instantConfirmation: 'icon-bolt',
    wheelchairAccessible: 'icon-wheelchair',
    cancellationPolicy: 'icon-window-delete',
  }
  return data[camelCase]
}

function viToEn(str) {
  if (!str) return null
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/gi, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/gi, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/gi, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/gi, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/gi, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/gi, 'y')
  str = str.replace(/đ/gi, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/gi, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/gi, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/gi, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/gi, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/gi, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/gi, 'Y')
  str = str.replace(/Đ/gi, 'D')
  return str
}
function stringToSlug(name) {
  if (!name) return null
  return _.toLower(viToEn(name))
    .replace(/\W+/g, ' ')
    .replace(/  +/g, ' ')
    .replace(/ /g, '-')
}

exports.stringToSlug = stringToSlug
exports.convertTripToData = (trip, wishTrips = {}) => {
  const hasLiked = wishTrips[helper.getObjectId(trip)] || false
  const examplePrice = {
    example: _.get(_.head(trip.price.country), 'example', 0),
    discount: _.get(_.head(trip.price.country), 'discount', 0),
    salePrice:
      (Number(_.get(_.head(trip.price.country), 'example', 0)) *
        (100 - Number(_.get(_.head(trip.price.country), 'discount', 0)))) /
      100,
  }
  const slug = stringToSlug(trip.title)
  const data = {
    uri: `/tour-detail/${trip._id}-${slug}`,
    url: `${API_HOST}/trips/${helper.getObjectId(trip)}`,
    _id: trip._id,
    images: _.map(trip.images, image => ({
      src: image.link,
      title: trip.place,
    })),
    hasLiked,
    numFeedback: trip.numFeedback || 0,
    averageRate: trip.averageRate || 5,
    urlVideo: trip.urlVideo,
    location: trip.location,
    place: trip.place,
    title: trip.title,
    feedBack: trip.feedBack,
    tags: trip.tags,
    specialTags: trip.specialTags,
    description: trip.description,
    duration: trip.duration,
    examplePrice,
    price: _.head(trip.price.country),
    description: trip.description,
    attributes: trip.attributes,
    about: _.map(trip.about, elem => {
      const newElem = {}
      if (elem.content.match(/Duration/gi)) {
        newElem.value = _.join(elem.value, ',')
      } else if (_.compact(elem.value).length) {
        newElem.subitems = _.join(elem.value, ',')
      }
      newElem.content = elem.content
      newElem.active = elem.active
      newElem.icon = getIcon(elem.content) || null
      return newElem
    }),
    experience: trip.experience,
    prepare: trip.prepare,
  }
  return data
}

exports.convertLocationToData = location => {
  if (!location) {
    return {}
  }
  const slug = stringToSlug(location.name)
  const uri = `/discovery/${location._id}-${slug}`
  return {
    uri,
    url: `${API_HOST}/discovery/?destination=${helper.getObjectId(location)}`,
    target: '_self',
    _id: location._id,
    introduce: location.introduce,
    name: location.name,
    image: { src: location.image.link, title: location.name },
  }
}

exports.convertTopDestinationToData = destination => {
  if (!destination) {
    return {}
  }
  const slug = stringToSlug(destination.name)
  const uri = `/discovery/${destination._id}-${slug}`
  return {
    uri,
    url: `${API_HOST}/discovery/?destination=${helper.getObjectId(
      destination
    )}`,
    _id: destination._id,
    name: destination.name,
    image: { src: destination.image.link, title: destination.name },
    total: destination.total,
  }
}

exports.convertSearchPlacesToData = (place, inverse) => {
  const combinePlaceName = inverse
    ? `${viToEn(place.location.name)}, ${viToEn(place.name)}`
    : `${viToEn(place.name)}, ${viToEn(place.location.name)}`
  const slug = stringToSlug(place.name)
  return {
    uri: `/search?destination=${slug}&page=1&size=20&v=${place._id}`,
    url: `${API_HOST}/search?destination=${helper.getObjectId(
      place
    )}&page=1&size=20`,
    _id: place._id,
    value: combinePlaceName,
  }
}

exports.convertSearchLocationToData = location => {}

exports.convertBasicTripToData = (trip, wishTrips = {}) => {
  const examplePrices = _.map(trip.price.country, price => {
    return {
      language: price.language,
      currency: price.currency,
      example: price.example,
      discount: price.discount,
    }
  })
  const hasLiked = wishTrips[helper.getObjectId(trip)] || false
  const slug = stringToSlug(trip.title)
  const data = {
    uri: `/tour-detail/${trip._id}-${slug}`,
    url: `${API_HOST}/trips/${helper.getObjectId(trip)}`,
    _id: trip._id,
    images: _.first(
      _.map(trip.images, image => ({
        src: image.link,
        title: trip.place,
      }))
    ),
    numFeedback: trip.numFeedback || 0,
    averageRate: trip.averageRate || 5,
    title: trip.title,
    feedBack: trip.feedBack,
    tags: trip.tags,
    specialTags: trip.specialTags,
    description: trip.description,
    duration: trip.duration,
    examplePrices,
    hasLiked,
  }
  return data
}
