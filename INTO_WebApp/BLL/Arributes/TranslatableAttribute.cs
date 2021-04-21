using System;
using System.IO;
using System.Runtime.CompilerServices;

namespace INTO.BLL.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class TranslatableAttribute : Attribute
    {
        public string Key { get; set; }
        public string Prefix { get; set; }

        public TranslatableAttribute([CallerMemberName] string key = null, [CallerFilePath] string prefix = "")
        {
            this.Key = key;
            this.Prefix = Path.GetFileNameWithoutExtension(prefix);
        }
    }
}