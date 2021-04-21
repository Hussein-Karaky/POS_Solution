using System;
using System.Collections.Generic;
using System.Text;

namespace POS_Solutions.BLL.Shared.Struct
{
    public class MetaData
    {
        private string key;
        public string Key { get { return this.key; } }
        public IDictionary<string, DataSettings> Settings { get; set; }
        public MetaData(string key = null)
        {
            this.key = key;
            this.Settings = new Dictionary<string, DataSettings>();
        }
    }
}
