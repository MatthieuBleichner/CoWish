import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { productsQueryOptions } from '../api/products.api';
import { ProductCollection } from '../components/ProductCollection';

const ArrowIcon = () => (
  <Box
    component="svg"
    aria-hidden="true"
    viewBox="0 0 24 24"
    sx={{ width: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 }}
  >
    <path d="M19 12H5m6 6-6-6 6-6" />
  </Box>
);

export function ProductsPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const productsQuery = useQuery(productsQueryOptions());

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('products.metadataTitle');
  }, [language, t]);

  return (
    <Box component="main" data-testid="products-page">
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
        <Button component={Link} to="/" color="secondary" startIcon={<ArrowIcon />}>
          {t('products.backHome')}
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
          CoWish
        </Typography>
      </Container>

      <Container
        component="section"
        maxWidth="lg"
        sx={{ minHeight: 'calc(100vh - 88px)', py: { xs: 6, md: 9 } }}
      >
        <Box sx={{ maxWidth: 760, mb: { xs: 6, md: 8 } }}>
          <Typography
            color="primary.dark"
            gutterBottom
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase'
            }}
          >
            {t('products.eyebrow')}
          </Typography>
          <Typography
            component="h1"
            sx={{
              maxWidth: 700,
              fontSize: 'clamp(3.1rem, 7vw, 6rem)',
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: '-0.065em'
            }}
          >
            {t('products.title')}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 3, maxWidth: 610, fontSize: '1.05rem', lineHeight: 1.7 }}
          >
            {t('products.introduction')}
          </Typography>
        </Box>

        {productsQuery.isError ? (
          <Alert
            severity="error"
            variant="outlined"
            action={
              <Button color="inherit" onClick={() => void productsQuery.refetch()}>
                {t('products.retry')}
              </Button>
            }
            sx={{ borderRadius: 3, p: 2 }}
          >
            <AlertTitle>{t('products.errorTitle')}</AlertTitle>
            {t('products.errorDescription')}
          </Alert>
        ) : productsQuery.isPending ? (
          <Paper variant="outlined" sx={{ minHeight: 220, borderRadius: 3 }}>
            <Stack
              data-testid="products-loading"
              direction="row"
              spacing={2}
              sx={{ minHeight: 220, alignItems: 'center', justifyContent: 'center' }}
              aria-label={t('products.loading')}
            >
              <CircularProgress color="inherit" size={28} />
              <Typography color="text.secondary">{t('products.loading')}</Typography>
            </Stack>
          </Paper>
        ) : (
          <ProductCollection products={productsQuery.data} language={language} />
        )}
      </Container>
    </Box>
  );
}
