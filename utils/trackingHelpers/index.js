import getCookie from '../getCookie';

const userEmail = () => {
    // set email key in dataLayer event to be used as variable in GTM
  // grabbed by Snapchat Tags
  const userData = getCookie('maisonette_user_data');
  const guestEmail = getCookie('maisonette_guest_email');
  const user = userData ? JSON.parse(userData) : null;

  return { userEmail: user?.email || guestEmail };
};

export default userEmail;
