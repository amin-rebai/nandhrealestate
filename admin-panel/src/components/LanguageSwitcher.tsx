import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  Box
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  const currentLanguage = i18n.language === 'ar' ? 'arabic' : i18n.language === 'fr' ? 'french' : 'english';

  return (
    <Box>
      <Tooltip title={t('navigation.language')}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ 
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="language-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={() => handleLanguageChange('en')}
          selected={i18n.language === 'en'}
          sx={{ minWidth: 120 }}
        >
          <ListItemIcon>
            <span style={{ fontSize: '1.2rem' }}>🇺🇸</span>
          </ListItemIcon>
          <ListItemText>{t('language.english')}</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleLanguageChange('ar')}
          selected={i18n.language === 'ar'}
          sx={{ minWidth: 120 }}
        >
          <ListItemIcon>
            <span style={{ fontSize: '1.2rem' }}>🇸🇦</span>
          </ListItemIcon>
          <ListItemText>{t('language.arabic')}</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleLanguageChange('fr')}
          selected={i18n.language === 'fr'}
          sx={{ minWidth: 120 }}
        >
          <ListItemIcon>
            <span style={{ fontSize: '1.2rem' }}>🇫🇷</span>
          </ListItemIcon>
          <ListItemText>{t('language.french', 'Français')}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
