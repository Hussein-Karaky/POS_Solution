using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Twilio;
using Twilio.Jwt.AccessToken;
using Twilio.Rest.Api.V2010;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace DAL.Meeting
{
    //using global::Twilio;
    //using global::Twilio.Rest.Api.V2010.Account;
    //using global::Twilio.Types;
    // Install the C# / .NET helper library from twilio.com/docs/csharp/install



    public class TwilioBase
    {
        // Find your Account Sid and Token at twilio.com/console
        // and set the environment variables. See http://twil.io/secure
        const string TWILIO_ACCOUNT_SID = "ACaba23a7d277cde563020cbd18849eaa5"; // Your Account Sid from twilio.com/user/account or https://www.twilio.com/console
        const string TWILIO_AUTH_TOKEN = "a53ea582b57d09b33ad3cdb76a425f5b";//https://www.twilio.com/console or https://www.twilio.com/console/project/api-keys
        const string API_KEY_SECRET = "QlBeNd3QvLJ4Z8HDM8zl004Ew5F7sTMT";//https://www.twilio.com/console/project/api-keys
        public static string SMS(string dest, string msg)
        {
            TwilioClient.Init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

            var message = MessageResource.Create(
                body: "Welcome to INTO, Here's your OTP:123456.",
                from: new PhoneNumber("+12314653453"),
                to: new PhoneNumber("+96171696194")
            );

            return message.Sid;
        }

        public static string Call(string dest)
        {
            if (dest != null && dest.Length > 0)
            {
                TwilioClient.Init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

                //            var to = new PhoneNumber("+9613815860");
                var to = new PhoneNumber(dest);// "+96171696194");//number must be verified by twilio
                var from = new PhoneNumber("+12314653453");
                var call = CallResource.Create(to, from,
                    url: new Uri("http://demo.twilio.com/docs/voice.xml"));
                return call.Sid;
            }
            return "Call failed!";
        }

        public static string WhatsAppMsg(string dest, string msg)
        {
            //string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            //string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

            TwilioClient.Init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
            
            var message = MessageResource.Create(
                from: new Twilio.Types.PhoneNumber(string.Concat("whatsapp:", "+12314653453")),
                body: msg,
                to: new Twilio.Types.PhoneNumber(string.Concat("whatsapp:", dest))
            );

            return message.Sid;
        }
        public static string NewAPIKey()
        {
            // Find your Account Sid and Token at twilio.com/console
            // and set the environment variables. See http://twil.io/secure
            //string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            //string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

            TwilioClient.Init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

            var newKey = NewKeyResource.Create();

            return newKey.Sid;
            //EXAMPLE JSON API RESPONSE
            //{
            //  "sid": "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            //  "friendly_name": "foo",
            //  "date_created": "Mon, 13 Jun 2016 22:50:08 +0000",
            //  "date_updated": "Mon, 13 Jun 2016 22:50:08 +0000",
            //  "secret": "foobar"
            //}
        }

       public static string NewAPIKey(string name)
        {
            // Find your Account Sid and Token at twilio.com/console
            // and set the environment variables. See http://twil.io/secure
            //string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            //string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

            TwilioClient.Init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

            var newKey = name != null && name.Length > 0 ? NewKeyResource.Create(friendlyName: name) : NewKeyResource.Create();

            //Console.WriteLine(newKey.Sid);

            return newKey.Sid;
            //EXAMPLE JSON API RESPONSE
            //{
            //    "sid": "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            //    "friendly_name": "User Joey",
            //    "date_created": "Mon, 13 Jun 2016 22:50:08 +0000",
            //    "date_updated": "Mon, 13 Jun 2016 22:50:08 +0000",
            //    "secret": "foobar"
            //}
        }

        public static string FetchAPIKey()
        {
            // Find your Account Sid and Token at twilio.com/console
            // and set the environment variables. See http://twil.io/secure
            //string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            //string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

            TwilioClient.Init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

            var key = KeyResource.Fetch(pathSid: "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

            return key.FriendlyName;
        }
       public static string GetTokenForVoice()
        {
            // These values are necessary for any access token
            const string twilioAccountSid = "ACaba23a7d277cde563020cbd18849eaa5";
            const string twilioApiKey = "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
            const string twilioApiSecret = "your_secret";

            // These are specific to Voice
            const string outgoingApplicationSid = "APXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
            const string identity = "user";

            // Create a Voice grant for this token
            var grant = new VoiceGrant();
            grant.OutgoingApplicationSid = outgoingApplicationSid;

            // Optional: add to allow incoming calls
            grant.IncomingAllow = true;

            var grants = new HashSet<IGrant>
        {
            { grant }
        };

            // Create an Access Token generator
            var token = new Token(
                twilioAccountSid,
                twilioApiKey,
                twilioApiSecret,
                identity,
                grants: grants);

            return token.ToJwt();
        }

        public static string GetFriendlyKey()
        {
            // Find your Account Sid and Token at twilio.com/console
            // and set the environment variables. See http://twil.io/secure
            string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

            TwilioClient.Init(accountSid, authToken);

            var key = KeyResource.Fetch(pathSid: "SK2a0747eba6abf96b7e3c3ff0b4530f6e");

            return key.FriendlyName;
            //EXAMPLE JSON API RESPONSE
            //{
            //    "sid": "SK2a0747eba6abf96b7e3c3ff0b4530f6e",
            //    "friendly_name": "foo",
            //    "date_created": "Mon, 13 Jun 2016 22:50:08 +0000",
            //    "date_updated": "Mon, 13 Jun 2016 22:50:08 +0000"
            //}
        }
        public static IList<string> GetFriendlyKeys(int limit)
        {
            // Find your Account Sid and Token at twilio.com/console
            // and set the environment variables. See http://twil.io/secure
            string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");
            IList<string> keysStr = new List<string>();

            TwilioClient.Init(accountSid, authToken);

            var keys = KeyResource.Read(limit: 20);

            keysStr = keys.Select(key => key.Sid).ToList();
            return keysStr;
            //EXAMPLE JSON API RESPONSE
//            {
//                "keys": [
//                  {
//                      "sid": "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//                      "friendly_name": "foo",
//                      "date_created": "Mon, 13 Jun 2016 22:50:08 +0000",
//                      "date_updated": "Mon, 13 Jun 2016 22:50:08 +0000"
//                  }
//                          ],
//                  "first_page_uri": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Keys.json?PageSize=50&Page=0",
//                  "end": 0,
//                  "previous_page_uri": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Keys.json?PageSize=50&Page=0",
//                  "uri": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Keys.json?PageSize=50&Page=0",
//                  "page_size": 50,
//                  "start": 0,
//                  "next_page_uri": "/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Keys.json?PageSize=50&Page=50",
//                  "page": 0
//              }
        }

        public static string UpdateKeySource(string friendlyName)
        {
            // Find your Account Sid and Token at twilio.com/console
            // and set the environment variables. See http://twil.io/secure
            string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

            TwilioClient.Init(accountSid, authToken);

            var key = KeyResource.Update(
                friendlyName: "friendly_name",
                pathSid: "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            );

            return key.FriendlyName;
            //EXAMPLE JSON API RESPONSE
            //{
            //    "sid": "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            //    "friendly_name": "friendly_name",
            //    "date_created": "Mon, 13 Jun 2016 22:50:08 +0000",
            //    "date_updated": "Mon, 13 Jun 2016 22:50:08 +0000"
            //}
        }
        public static bool DeleteKeySource(string pathSid)
        {
            // Find your Account Sid and Token at twilio.com/console
            // and set the environment variables. See http://twil.io/secure
            string accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
            string authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");

            TwilioClient.Init(accountSid, authToken);

            return KeyResource.Delete(pathSid: "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            //EXAMPLE JSON API RESPONSE
            //{
            //    "sid": "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            //    "friendly_name": "friendly_name",
            //    "date_created": "Mon, 13 Jun 2016 22:50:08 +0000",
            //    "date_updated": "Mon, 13 Jun 2016 22:50:08 +0000"
            //}
        }

        public static IList<string> Authenticate()
        {
            const string apiKey = "SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // You can generate this from www.twilio.com/console/runtime/api-keys/create
            const string apiSecret = "your_api_secret"; // You can generate this from www.twilio.com/console/runtime/api-keys/create

            // DANGER! This is insecure. See http://twil.io/secure
            TwilioClient.Init(apiKey, apiSecret, TWILIO_ACCOUNT_SID);

            // Proof request to check credentials are working.
            // Retrieving your account information
            var accounts = AccountResource.Read();

            return accounts.Select(acnt => acnt.Sid).ToList();
        }

        public static string AccessTokenVideo()
        {
            const string twilioAccountSid = "ACaba23a7d277cde563020cbd18849eaa5";
            const string twilioApiKey = "SK2c6f8ce2d5d052b46362c71e54f8d6e6";
            const string twilioApiSecret = "jzIuH7vDf8SrQYDBoWyi3gQRpYA2ZuI7";

            // These are specific to Video
            const string identity = "user";

            // Create a Video grant for this token
            var grant = new VideoGrant();
            grant.Room = "cool room";

            var grants = new HashSet<IGrant> { grant };

            // Create an Access Token generator
            var token = new Token(
                twilioAccountSid,
                twilioApiKey,
                twilioApiSecret,
                identity: identity,
                grants: grants);

            return token.ToJwt();
        }
    }
}
