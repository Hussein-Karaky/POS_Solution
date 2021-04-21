namespace BLL.Tutor
{
    public class TutorEducation
    {
        public long Id { get; set; }
        public long? TutorId { get; set; }
        public string Institute { get; set; }
        public string Major { get; set; }
        public int? DegreeId { get; set; }
        public string Degree { get; set; }
    }
}
