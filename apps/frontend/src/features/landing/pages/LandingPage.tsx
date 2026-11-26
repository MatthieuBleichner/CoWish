import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

const HeartIcon = ({ size = 18 }: { size?: number }) => (
  <Box
    component="svg"
    aria-hidden="true"
    viewBox="0 0 24 24"
    sx={{ width: size, fill: 'currentColor' }}
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
  </Box>
);

const Brand = () => (
  <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
    <Box
      sx={{
        width: 34,
        height: 34,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '50%',
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}
    >
      <HeartIcon />
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
      CoWish
    </Typography>
  </Stack>
);

export function LandingPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const steps = ['gather', 'compare', 'choose'] as const;

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('metadata.title');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('metadata.description'));
  }, [language, t]);

  return (
    <Box component="main" data-testid="landing-page">
      <Container
        component="header"
        maxWidth="lg"
        sx={{
          minHeight: 88,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Link href="#top" color="inherit" underline="none" aria-label={t('navigation.home')}>
          <Brand />
        </Link>
        <Stack direction="row" spacing={{ xs: 1, sm: 3 }} sx={{ alignItems: 'center' }}>
          <Button
            component={RouterLink}
            to="/products"
            color="secondary"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            {t('navigation.products')}
          </Button>
          <Button
            component="a"
            href="#how-it-works"
            color="secondary"
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            {t('navigation.howItWorks')}
          </Button>
          <ToggleButtonGroup
            data-testid="language-switcher"
            exclusive
            size="small"
            value={language}
            onChange={(_event, value: 'en' | 'fr' | null) => {
              if (value) void i18n.changeLanguage(value);
            }}
            aria-label={t('navigation.language')}
            sx={{
              gap: '3px',
              p: '3px',
              border: 1,
              borderColor: 'divider',
              borderRadius: '999px',
              '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                ml: 0
              },
              '& .MuiToggleButton-root': {
                minWidth: 34,
                border: 0,
                borderRadius: '999px !important',
                px: 1,
                py: 0.75,
                color: '#716761',
                fontSize: '0.68rem',
                fontWeight: 700,
                lineHeight: 1,
                '&:hover': {
                  bgcolor: 'rgba(40, 35, 32, 0.06)'
                },
                '&.Mui-selected': {
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  '&:hover': {
                    bgcolor: 'secondary.main'
                  }
                },
                '&.Mui-focusVisible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2
                }
              }
            }}
          >
            <ToggleButton value="en" aria-label={t('navigation.english')}>
              EN
            </ToggleButton>
            <ToggleButton value="fr" aria-label={t('navigation.french')}>
              FR
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Container>

      <Container id="top" component="section" maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }} sx={{ minHeight: 586, alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              color="primary.dark"
              sx={{
                mb: 2,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase'
              }}
            >
              {t('hero.eyebrow')}
            </Typography>
            <Typography
              component="h1"
              sx={{
                maxWidth: 700,
                fontSize: 'clamp(3.25rem, 7vw, 6.4rem)',
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: '-0.065em'
              }}
            >
              {t('hero.titleStart')}
              <br />
              {t('hero.titleMiddle')}{' '}
              <Box
                component="em"
                sx={{
                  color: 'primary.main',
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600
                }}
              >
                {t('hero.titleEmphasis')}
              </Box>
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 570, my: 4, fontSize: 18, lineHeight: 1.7 }}
            >
              {t('hero.introduction')}
            </Typography>
            <Button
              component="a"
              href="#how-it-works"
              variant="contained"
              color="secondary"
              size="large"
            >
              {t('hero.action')} →
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              aria-label={t('hero.illustrationLabel')}
              sx={{
                position: 'relative',
                minHeight: { xs: 380, md: 500 },
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: { xs: '7% -3% 3% 3%', sm: '9% -6% 3% 5%' },
                  borderRadius: '44% 56% 62% 38% / 54% 38% 62% 46%',
                  bgcolor: '#dce4d5',
                  transform: 'rotate(7deg)'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 0,
                  width: { xs: 160, sm: 200 },
                  height: { xs: 140, sm: 180 },
                  top: { xs: '1%', sm: '2%' },
                  right: { xs: '-3%', sm: '-5%' },
                  border: '1px solid #d7a388',
                  borderRadius: '44% 56% 53% 47% / 50% 43% 57% 50%',
                  transform: 'rotate(8deg)'
                }}
              />
              <Paper
                variant="outlined"
                sx={{
                  position: 'absolute',
                  zIndex: 1,
                  top: { xs: '12%', sm: '18%' },
                  left: { xs: '-1%', sm: '-3%' },
                  width: { xs: 150, sm: 190 },
                  p: { xs: 1.75, sm: 2.5 },
                  borderRadius: 2.25,
                  bgcolor: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(12px)',
                  transform: 'rotate(-7deg)'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: '#7b716a', fontSize: '0.72rem', fontWeight: 400 }}
                >
                  {t('hero.alexPick')}
                </Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 700 }}>{t('hero.cozyCabin')}</Typography>
              </Paper>
              <Paper
                variant="outlined"
                sx={{ zIndex: 2, width: { xs: 215, sm: 245 }, p: 3.5, borderRadius: 3 }}
              >
                <Box sx={{ color: 'primary.main', mb: 3 }}>
                  <HeartIcon size={42} />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#7b716a', fontSize: '0.72rem', fontWeight: 400 }}
                >
                  {t('hero.groupFavorite')}
                </Typography>
                <Typography variant="h6" sx={{ my: 1, fontWeight: 700 }}>
                  {t('hero.forestHideaway')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: '#7b716a', fontSize: '0.72rem', fontWeight: 400 }}
                >
                  {t('hero.activity')}
                </Typography>
              </Paper>
              <Paper
                variant="outlined"
                sx={{
                  position: 'absolute',
                  zIndex: 1,
                  right: { xs: '-1%', sm: '-3%' },
                  bottom: { xs: '9%', sm: '13%' },
                  width: { xs: 150, sm: 190 },
                  p: { xs: 1.75, sm: 2.5 },
                  borderRadius: 2.25,
                  bgcolor: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(12px)',
                  transform: 'rotate(6deg)'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: '#7b716a', fontSize: '0.72rem', fontWeight: 400 }}
                >
                  {t('hero.samPick')}
                </Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 700 }}>{t('hero.beachHouse')}</Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container
        id="how-it-works"
        component="section"
        maxWidth="lg"
        sx={{ py: { xs: 8, md: 12 }, borderTop: 1, borderColor: 'divider' }}
      >
        <Typography
          color="primary.dark"
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase'
          }}
        >
          {t('howItWorks.eyebrow')}
        </Typography>
        <Typography
          component="h2"
          sx={{
            mt: 2,
            mb: 7,
            maxWidth: 600,
            fontSize: 'clamp(2.2rem, 4vw, 3.7rem)',
            fontWeight: 700,
            lineHeight: 1.08
          }}
        >
          {t('howItWorks.title')}
        </Typography>
        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid key={step} size={{ xs: 12, md: 4 }}>
              <Paper
                component="article"
                data-testid={`landing-step-${step}`}
                elevation={0}
                sx={{ height: '100%', p: 3.5, borderRadius: 2.5 }}
              >
                <Typography color="primary.dark" variant="caption" sx={{ fontWeight: 700 }}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography component="h3" variant="h6" sx={{ mt: 5, mb: 1.5, fontWeight: 700 }}>
                  {t(`howItWorks.steps.${step}.title`)}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {t(`howItWorks.steps.${step}.description`)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container component="footer" maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            py: 4,
            borderTop: 1,
            borderColor: 'divider',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between'
          }}
        >
          <Link href="#top" color="inherit" underline="none">
            <Brand />
          </Link>
          <Typography color="text.secondary" variant="body2">
            {t('footer.tagline')}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
