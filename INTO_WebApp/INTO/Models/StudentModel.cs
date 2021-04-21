using BLL.Shared;
using BLL.Student;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace INTO.Models
{
    public class StudentModel : LoginModel
    {
        public StudentModel()
        {
            Countries = new List<LookUpDetails>();
        }
        public IList<LookUpDetails> Countries { get; set; }

        [JsonIgnore]
        public Student Student { get { return User != null && User.Type == EntityType.Student ? (Student)User : null; } set { User = value; } }

    }
}
