using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace BLL.Payment
{
    public class Session
    {
        public Session()
        {
        }

        public Session(string json)
        {
            JObject jObject = JObject.Parse(json);
            this.Id = (long) jObject["Id"];
            this.DateStamp = (DateTime) jObject["DateStamp"];
            this.Title = (string) jObject["Title"];
            this.UID = (long) jObject["UID"];
            this.Amount = (decimal)jObject["Amount"];
            this.Currency = (string)jObject["Currency"];
            this.Service = (string) jObject["Service"];
            this.TutorId = (long) jObject["TutorId"];
            this.Method = (string) jObject["Method"];
            this.CancelationDate = (DateTime)jObject["CancelationDate"];
            this.Token = (string)jObject["Token"];
            this.TutorName = (string)jObject["TutorName"];
            this.AutoCapture = (Boolean)jObject["AutoCapture"];
            this.CaptureOn = (DateTime)jObject["CaptureOn"];
            this.Photo = (string)jObject["Photo"];
            this.HasBlInfo = (Boolean)jObject["HasBlInfo"];
        }
        public long Id { set; get; }
        public DateTime DateStamp { get; set; }
        public string DateString { get; set; }
        public string Title { set; get; }
        public long UID { set; get; }
        public decimal Amount { set; get; }
        public string Currency { set; get; }
        public string Service { get; set; }
        public int ServiceId { get; set; }
        public long TutorId { get; set; }
        public string TutorName { get; set; }
        public string Method { get; set; }
        public DateTime CancelationDate { get; set; }
        public Boolean AutoCapture { get; set; }
        public DateTime CaptureOn { get; set; }
        public string Photo { get; set; }
        public string Token { get; set; }
        public Boolean isPaid { get; set; }
        public Boolean HasBlInfo { get; set; }
        public IList<Operation> Operations { get; set; }
    }
}