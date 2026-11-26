import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Product } from '@cowish/shared';
import { useTranslation } from 'react-i18next';

interface ProductTileProps {
  product: Product;
  language: 'en' | 'fr';
}

export function ProductTile({ product, language }: ProductTileProps) {
  const { t } = useTranslation();
  const locale = language === 'fr' ? 'fr-FR' : 'en-GB';
  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(date)
    );

  return (
    <Card
      data-testid={`product-tile-${product.id}`}
      component="article"
      variant="outlined"
      sx={{
        height: '100%',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '0 18px 55px rgb(62 52 45 / 7%)'
      }}
    >
      <Box sx={{ height: { xs: 235, sm: 300 }, position: 'relative', bgcolor: '#eee9df' }}>
        <CardMedia
          component="img"
          image={product.imageUrl}
          alt=""
          sx={{ height: '100%', objectFit: 'cover' }}
        />
        <Chip
          data-testid="product-availability"
          label={t(`products.availability.${product.availability}`)}
          size="small"
          sx={{
            position: 'absolute',
            top: 18,
            right: 18,
            bgcolor: 'rgba(255, 255, 255, 0.92)',
            fontWeight: 700,
            boxShadow: '0 5px 20px rgb(40 35 32 / 10%)'
          }}
        />
      </Box>

      <CardContent sx={{ p: { xs: 2.75, sm: 3.5 }, '&:last-child': { pb: 3.5 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
        >
          <Typography
            data-testid="product-name"
            component="h2"
            variant="h5"
            sx={{ fontWeight: 700 }}
          >
            {product.name}
          </Typography>
          <Typography color="primary.dark" sx={{ flexShrink: 0, fontWeight: 700 }}>
            {formatPrice(product.price, product.currency)}
          </Typography>
        </Stack>

        <Stack
          component="dl"
          spacing={1}
          divider={<Divider flexItem />}
          sx={{ my: 3, py: 1, borderBlock: 1, borderColor: 'divider' }}
        >
          {[
            [t('products.added'), formatDate(product.createdAt)],
            [t('products.lastChecked'), formatDate(product.lastCheckedAt)],
            [t('products.identifier'), product.id]
          ].map(([label, value], index) => (
            <Stack
              component="div"
              key={label}
              direction="row"
              spacing={2}
              sx={{ py: 0.5, justifyContent: 'space-between' }}
            >
              <Typography component="dt" variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography
                data-testid={index === 2 ? 'product-identifier' : undefined}
                component="dd"
                variant="caption"
                sx={{ m: 0, overflowWrap: 'anywhere', fontWeight: 600, textAlign: 'right' }}
              >
                {value}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Accordion
          data-testid="product-price-history"
          disableGutters
          elevation={0}
          sx={{ '&::before': { display: 'none' } }}
        >
          <AccordionSummary sx={{ minHeight: 40, px: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {t('products.priceHistory', { count: product.priceHistory.length })}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ maxHeight: 190, overflowY: 'auto', px: 0, pt: 0 }}>
            <Stack divider={<Divider flexItem />}>
              {product.priceHistory
                .slice()
                .reverse()
                .map((observation, index) => (
                  <Stack
                    data-testid="product-price-observation"
                    key={`${observation.checkedAt}-${index}`}
                    direction="row"
                    spacing={2}
                    sx={{ py: 1, justifyContent: 'space-between' }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(observation.checkedAt)}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {formatPrice(observation.price, observation.currency)}
                    </Typography>
                  </Stack>
                ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Button
          data-testid="product-source-link"
          component="a"
          href={product.sourceUrl}
          target="_blank"
          rel="noreferrer"
          variant="text"
          sx={{ mt: 2, px: 0 }}
        >
          {t('products.viewSource')}
          <Box component="span" sx={{ ml: 1 }}>
            ↗
          </Box>
        </Button>
      </CardContent>
    </Card>
  );
}
