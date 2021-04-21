using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Shared.Attributes
{
    [AttributeUsage(
        AttributeTargets.All,
AllowMultiple = false)]
    public class DataAttribute : Attribute
    {
        private string key;
        public string Key { get { return this.key; } }
        public DataAttribute(string key)
        {
            this.key = key;
        }
    }
}
