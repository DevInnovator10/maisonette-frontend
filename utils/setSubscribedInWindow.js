import getCookie from './getCookie';

const setSubscribedInWindow = () => {
  // the cookie below is updated based on the subscription status of a registered user
  // // or when an email is added via newsletter/footer components
  const emailSubscription = getCookie('subscribed_to_emails');

  if (global.window && emailSubscription) {
    // expose user subscription status to browser for Wunderkind GA tracking
    global.window.maisonette_subscribed_to_emails = true;
  }
};

export default setSubscribedInWindow;
