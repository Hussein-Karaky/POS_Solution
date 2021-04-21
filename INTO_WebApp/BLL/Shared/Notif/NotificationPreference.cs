namespace BLL.Shared
{
    public class NotificationPreference
    {
        public long Id { set; get; }
        public string Type { set; get; }
        public bool EMail { set; get; }
        public bool SMS { set; get; }
        public bool Push { set; get; }
    }
}
