import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Product } from '@cowish/shared';
import { useTranslation } from 'react-i18next';
import { ProductTile } from './ProductTile';

interface ProductCollectionProps {
  products: Product[];
  language: 'en' | 'fr';
}

export function ProductCollection({ products, language }: ProductCollectionProps) {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <Paper
        data-testid="products-empty-state"
        variant="outlined"
        sx={{ borderRadius: 3, p: { xs: 3, sm: 6 } }}
      >
        <Typography component="h2" variant="h4" gutterBottom>
          {t('products.emptyTitle')}
        </Typography>
        <Typography color="text.secondary">{t('products.emptyDescription')}</Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3.5}>
      {products.map(product => (
        <Grid key={product.id} size={{ xs: 12, md: 6 }}>
          <ProductTile product={product} language={language} />
        </Grid>
      ))}
    </Grid>
  );
}
