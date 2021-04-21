using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Text;

namespace POS_Solutions.BLL.Shared.Graphics
{
    public class Display
    {
        public string Text { get; set; }
        public string Format { get; set; }
        private DataVisibility visibility = DataVisibility.Visible;
        [JsonConverter(typeof(StringEnumConverter))]
        public DataVisibility Visibility { get { return this.visibility; } set { this.visibility = value; } }
        public int Order { get; set; }
        public enum DataVisibility
        {
            Visible = 0,
            Invisible = 1,
            Screen768To959 = 2,
            Screen600To767 = 3,
            Screen480To599 = 4,
            Screen479 = 5
        }
    }
}
