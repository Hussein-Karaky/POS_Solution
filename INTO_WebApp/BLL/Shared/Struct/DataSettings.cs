using BLL.Shared.Graphics;
using System;
using System.Collections.Generic;
using System.Text;
using static BLL.Shared.Graphics.Display;

namespace BLL.Shared.Struct
{
    public class DataSettings
    {
        private Type dataType = default(Type);
        public Type DataType { get { return this.dataType; } }
        private string propertyName;
        public string PropertyName { get { return this.propertyName; } }
        private string key;
        public string Key { get { return this.key; } }
        public Display Display { get; set; }
        public DataSettings(string propertyName, Type dataType = default(Type), string key = null) {
            this.propertyName = propertyName;
            this.dataType = dataType;
            this.key = key;
        }
    }
}
