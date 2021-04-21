namespace BLL.Shared
{
    public class LookUpDetails
    {
        public int Id { get; set; }
        public string Keyword { get; set; }
        public int LookupDetailsId { get; set; }
        public string LookupDetailsDescription { get; set; }
        public int LanguageId { get; set; }
        public string Context { get; set; }
        public string DataType { get; set; }
    }
}
