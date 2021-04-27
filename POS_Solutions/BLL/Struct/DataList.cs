using POS_Solutions.BLL.Shared.Attributes;
using POS_Solutions.BLL.Shared.Graphics;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace POS_Solutions.BLL.Shared.Struct
{
    public class DataList<T>
    {
        public MetaData MetaData { get; set; }
        public ICollection<T> Data { get; set; }

        public DataList() : this(new List<T>()) { }
        public DataList(ICollection<T> data)
        {
            Type mainType = typeof(T);
            IEnumerator<DataAttribute> typeDataInfo = mainType.GetCustomAttributes<DataAttribute>().GetEnumerator();
            string mainKey = null;
            if (typeDataInfo.MoveNext())
            {
                mainKey = typeDataInfo.Current.Key;
            }
            this.MetaData = new MetaData(mainKey);
            PropertyInfo[] props = mainType.GetProperties();
            Array.ForEach(props, prop =>
            {
                IEnumerator<GridSettingsAttribute> settings = prop.GetCustomAttributes<GridSettingsAttribute>().GetEnumerator();
                if (settings.MoveNext())
                {
                    GridSettingsAttribute gridSettings = settings.Current;
                    Type propType = prop.PropertyType;
                    IEnumerator<DataAttribute> dataInfo = propType.GetCustomAttributes<DataAttribute>().GetEnumerator();
                    string key = null;
                    if (dataInfo.MoveNext())
                    {
                        key = dataInfo.Current.Key;
                    }
                    string propName = prop.Name.Length > 1 ? string.Concat(Char.ToLowerInvariant(prop.Name[0]), prop.Name.Substring(1)) : prop.Name.ToLower();
                    this.MetaData.Settings.Add(propName, new DataSettings(propName, propType, key)
                    {
                        Display = new Display
                        {
                            Visibility = gridSettings.Visibility,
                            Text = gridSettings.Alias
                        }
                    });
                }
            });
            this.Data = data;
        }
    }
}
