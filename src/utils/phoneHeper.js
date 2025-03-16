const  formatPhoneNumber = (phoneNumber) => {
    // Remove any non-numeric characters
    phoneNumber = phoneNumber.replace(/\D/g, '');
  
    // Check if the number starts with "234"
    if (phoneNumber.startsWith('234')) {
      return phoneNumber;
    }
  
    // If the number starts with "0", replace it with "234"
    if (phoneNumber.startsWith('0')) {
      return '234' + phoneNumber.substring(1);
    }
  
    // If the number is 10 digits long, prepend "234"
    if (phoneNumber.length === 10) {
      return '234' + phoneNumber;
    }
  
    // Return the phone number as it is if it does not meet any condition
    return phoneNumber;
  }
  
  module.exports = { formatPhoneNumber };