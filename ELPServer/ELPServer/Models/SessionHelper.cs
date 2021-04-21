using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Into.Models
{
    public static class SessionHelper
    {
        public static void SetObjectAsJson(this ISession session, string key, object value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T GetObjectFromJson<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }       

        //add a student object list in session and retrieve from session
        //        List<WtrStudent> _sList = new List<WtrStudent>();
        //        SessionHelper.SetObjectAsJson(HttpContext.Session, "userObject", _sList);
        //List<WtrStudent> _sessionList = SessionHelper.GetObjectFromJson<List<WtrStudent>>(HttpContext.Session, "userObject");

    }
}
