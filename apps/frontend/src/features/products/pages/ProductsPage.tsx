import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { importProduct, productsQueryOptions, refreshProducts } from '../api/products.api';
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

const RefreshIcon = () => (
  <Box
    component="svg"
    aria-hidden="true"
    viewBox="0 0 24 24"
    sx={{ width: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 }}
  >
    <path d="M20 6v5h-5M4 18v-5h5M6.1 9a7 7 0 0 1 11.4-2.4L20 9M4 15l2.5 2.4A7 7 0 0 0 17.9 15" />
  </Box>
);

export function ProductsPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === 'fr' ? 'fr' : 'en';
  const queryClient = useQueryClient();
  const [productUrl, setProductUrl] = useState('');
  const productsQuery = useQuery(productsQueryOptions());
  const importMutation = useMutation({
    mutationFn: importProduct,
    onSuccess: async () => {
      setProductUrl('');
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
  const refreshMutation = useMutation({
    mutationFn: refreshProducts,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const lastRefresh = productsQuery.data?.reduce<string | undefined>(
    (latest, product) =>
      latest === undefined || Date.parse(product.lastCheckedAt) > Date.parse(latest)
        ? product.lastCheckedAt
        : latest,
    undefined
  );
  const lastRefreshDateTime = lastRefresh
    ? new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(lastRefresh)
      )
    : undefined;

  const handleImport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = productUrl.trim();
    if (url !== '') importMutation.mutate(url);
  };

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
        <Box sx={{ maxWidth: 760, mb: { xs: 4, md: 5 } }}>
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

        <Paper
          component="form"
          data-testid="product-import-form"
          variant="outlined"
          onSubmit={handleImport}
          sx={{ mb: { xs: 6, md: 8 }, p: { xs: 2, sm: 2.5 }, borderRadius: 3 }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ alignItems: 'flex-start' }}
          >
            <TextField
              type="url"
              name="productUrl"
              label={t('products.import.label')}
              placeholder={t('products.import.placeholder')}
              value={productUrl}
              onChange={event => {
                setProductUrl(event.target.value);
                if (importMutation.isError) importMutation.reset();
              }}
              required
              fullWidth
              disabled={importMutation.isPending}
              error={importMutation.isError}
              helperText={importMutation.isError ? t('products.import.error') : undefined}
              slotProps={{ htmlInput: { 'aria-describedby': 'product-import-hint' } }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={importMutation.isPending || productUrl.trim() === ''}
              sx={{ minHeight: 56, minWidth: { sm: 150 }, width: { xs: '100%', sm: 'auto' } }}
            >
              {importMutation.isPending
                ? t('products.import.submitting')
                : t('products.import.submit')}
            </Button>
          </Stack>
          <Typography
            id="product-import-hint"
            color="text.secondary"
            variant="body2"
            sx={{ mt: 1 }}
          >
            {t('products.import.hint')}
          </Typography>
        </Paper>

        {!productsQuery.isPending && !productsQuery.isError ? (
          <Stack
            data-testid="products-refresh-controls"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ mb: 3, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'flex-end' }}
          >
            <Typography color="text.secondary" variant="body2" sx={{ mr: { sm: 'auto' } }}>
              {lastRefreshDateTime
                ? t('products.refresh.lastRefresh', { date: lastRefreshDateTime })
                : t('products.refresh.never')}
            </Typography>
            <Button
              data-testid="products-refresh-button"
              variant="outlined"
              startIcon={
                refreshMutation.isPending ? (
                  <CircularProgress color="inherit" size={18} />
                ) : (
                  <RefreshIcon />
                )
              }
              disabled={refreshMutation.isPending || productsQuery.data.length === 0}
              onClick={() => refreshMutation.mutate()}
            >
              {refreshMutation.isPending
                ? t('products.refresh.refreshing')
                : t('products.refresh.action')}
            </Button>
          </Stack>
        ) : null}

        {refreshMutation.isError ? (
          <Alert severity="warning" variant="outlined" sx={{ mb: 3, borderRadius: 3 }}>
            {t('products.refresh.error')}
          </Alert>
        ) : null}

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
