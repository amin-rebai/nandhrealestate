import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextField,
  Box,
  Tabs,
  Tab,
  Paper,
  TextFieldProps
} from '@mui/material';

interface MultilingualValue {
  en?: string;
  ar?: string;
  fr?: string;
}

interface MultilingualTextFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: MultilingualValue;
  onChange: (value: MultilingualValue) => void;
  label: string;
  optionalLanguages?: boolean; // If true, languages are optional
}

const MultilingualTextField: React.FC<MultilingualTextFieldProps> = ({
  value,
  onChange,
  label,
  disabled,
  multiline,
  rows,
  optionalLanguages = true,
  ...textFieldProps
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  // Helper to check if a language has content
  const hasContent = (lang: 'en' | 'ar' | 'fr') => {
    return (value[lang] || '').trim().length > 0;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (language: 'en' | 'ar' | 'fr', inputValue: string) => {
    onChange({
      ...value,
      [language]: inputValue
    });
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 500
            }
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {t('content.english')}
                {hasContent('en') && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4B0E14' }} />}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {t('content.arabic')}
                {hasContent('ar') && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4B0E14' }} />}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {t('content.french') || 'Français'}
                {hasContent('fr') && <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4B0E14' }} />}
              </Box>
            }
          />
        </Tabs>
        
        <Box sx={{ p: 2, pt: 1 }}>
          {activeTab === 0 && (
            <TextField
              {...textFieldProps}
              fullWidth
              label={`${label} (English)`}
              value={value.en}
              onChange={(e) => handleInputChange('en', e.target.value)}
              disabled={disabled}
              multiline={multiline}
              rows={rows}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: '#4B0E14'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4B0E14'
                  }
                }
              }}
            />
          )}
          
          {activeTab === 1 && (
            <TextField
              {...textFieldProps}
              fullWidth
              label={`${label} (العربية)`}
              value={value.ar}
              onChange={(e) => handleInputChange('ar', e.target.value)}
              disabled={disabled}
              multiline={multiline}
              rows={rows}
              sx={{
                direction: 'rtl',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: '#4B0E14'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4B0E14'
                  }
                },
                '& .MuiInputBase-input': {
                  textAlign: 'right',
                  fontFamily: 'Tajawal, Cairo, Amiri, sans-serif'
                }
              }}
            />
          )}
            {activeTab === 2 && (
              <TextField
                {...textFieldProps}
                fullWidth
                label={`${label} (Français)`}
                value={value.fr ?? ''}
                onChange={(e) => handleInputChange('fr', e.target.value)}
                disabled={disabled}
                multiline={multiline}
                rows={rows}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: '#4B0E14' },
                    '&.Mui-focused fieldset': { borderColor: '#4B0E14' }
                  }
                }}
              />
            )}
        </Box>
      </Paper>
    </Box>
  );
};

export default MultilingualTextField;
