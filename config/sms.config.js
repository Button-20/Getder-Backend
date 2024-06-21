const fetch = require("node-fetch");

const smsConfig = async ({ destination, message }) => {
  try {
     await fetch(
      `https://sms.nalosolutions.com/smsbackend/clientapi/Resl_Nalo/send-message/?username=${process.env.NALO_SOLUTIONS_USERNAME}&password=${process.env.NALO_SOLUTIONS_PASSWORD}&type=0&destination=${destination}&dlr=1&source=GETDER&message=${message}`
    );
    return 'SMS sent successfully';
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = smsConfig