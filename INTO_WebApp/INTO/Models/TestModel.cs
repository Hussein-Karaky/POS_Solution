using BLL.Test;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace INTO.Models
{
    public class TestModel: LoginModel
    {
        public Test test { get; set; }
        public IList<Question> question = new List<Question>();
        public string serializedTest { get; set; }

    }
}
