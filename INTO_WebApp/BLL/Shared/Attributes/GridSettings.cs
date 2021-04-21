using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using static BLL.Shared.Graphics.Display;

namespace BLL.Shared.Attributes
{
    [AttributeUsage(
   AttributeTargets.Field |
   AttributeTargets.Property,
   AllowMultiple = false)]
    public class GridSettingsAttribute : Attribute
    {
        private DataVisibility visibility = DataVisibility.Visible;
        public DataVisibility Visibility { get { return this.visibility; } }
        private string alias;
        public string Alias { get { return this.alias; } }
        public GridSettingsAttribute(DataVisibility visibility, [CallerMemberName] string alias = null)
        {
            this.visibility = visibility;
            this.alias = alias;
        }
    }
}
