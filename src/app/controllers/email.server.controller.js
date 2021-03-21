var nodemailer = require('nodemailer');
exports.sendMailResetPass = async (userEmail, tokenReset) => {
    // const link = `${process.env.HOST || "http://localhost:9000"}/password/reset/${tokenReset}`
    const link = `http://localhost:3000/reset-password/${tokenReset}`
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'zesumen1@gmail.com',
            pass: 'we.yolo2'
        }
    });
    const mainOptions = {
        from: 'Thắng vọi with love',
        to: userEmail,
        subject: 'Thay đổi mật khẩu  traveloka',
        text: 'You recieved message from',
        html: `<p>Bạn đang nhận được điều này bởi vì bạn (hoặc người khác) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn</p>
        <p>Vui lòng nhấp vào liên kết sau  để hoàn tất quy trình thay đổi mật khẩu: <a href=${link}  rel="follow, index">Link</a></p>
        <p>Nếu bạn không yêu cầu điều này, xin vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi. </p>`
    }
    let info = await transporter.sendMail(mainOptions);
}

exports.sendMailSuccessResetPass = async (userEmail) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'zesumen1@gmail.com',
            pass: 'we.yolo2'
        }
    });
    const mainOptions = {
        from: 'Thắng vọi with love',
        to: userEmail,
        subject: 'Thay đổi mật khẩu traveloka thanh công',
        text: 'You recieved message from',
        html: `<p>Bạn đã thay đổi mật khẩu tài khoản ${userEmail}</p>`
    }
    let info = await transporter.sendMail(mainOptions);
} 