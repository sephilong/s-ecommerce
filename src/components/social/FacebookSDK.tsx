
'use client';

import Script from 'next/script';

export function FacebookSDK({ appId }: { appId: string }) {
  if (!appId) return null;

  return (
    <>
      <Script
        id="facebook-sdk"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.fbAsyncInit = function() {
              FB.init({
                appId: '${appId}',
                xfbml: true,
                version: 'v19.0'
              });
            };
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = "https://connect.facebook.net/vi_VN/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
          `,
        }}
      />
      <div id="fb-root" />
    </>
  );
}
