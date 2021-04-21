using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Utilities
{
    public class PasswordGeneratorSettings
    {
		const string LOWERCASE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz";
		const string UPPERCASE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const string NUMERIC_CHARACTERS = "0123456789";
		const string SPECIAL_CHARACTERS = @"!#$%&*@\";
		const int PASSWORD_LENGTH_MIN = 8;
		const int PASSWORD_LENGTH_MAX = 128;

		public bool IncludeLowercase { get; set; }
		public bool IncludeUppercase { get; set; }
		public bool IncludeNumbers { get; set; }
		public bool IncludeSpecial { get; set; }
		public int PasswordLength { get; set; }
		public string CharacterSet { get; set; }
		public int MaximumAttempts { get; set; }

		public PasswordGeneratorSettings(bool includeLowercase, bool includeUppercase, bool includeNumbers, bool includeSpecial, int passwordLength)
		{
			IncludeLowercase = includeLowercase;
			IncludeUppercase = includeUppercase;
			IncludeNumbers = includeNumbers;
			IncludeSpecial = includeSpecial;
			PasswordLength = passwordLength;

			StringBuilder characterSet = new StringBuilder();

			if (includeLowercase)
			{
				characterSet.Append(LOWERCASE_CHARACTERS);
			}

			if (includeUppercase)
			{
				characterSet.Append(UPPERCASE_CHARACTERS);
			}

			if (includeNumbers)
			{
				characterSet.Append(NUMERIC_CHARACTERS);
			}

			if (includeSpecial)
			{
				characterSet.Append(SPECIAL_CHARACTERS);
			}

			CharacterSet = characterSet.ToString();
		}

		public bool IsValidLength()
		{
			return PasswordLength >= PASSWORD_LENGTH_MIN && PasswordLength <= PASSWORD_LENGTH_MAX;
		}

		public string LengthErrorMessage()
		{
			return string.Format("Password length must be between {0} and {1} characters", PASSWORD_LENGTH_MIN, PASSWORD_LENGTH_MAX);
		}
	}
}
