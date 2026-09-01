import { defineQuery } from "next-sanity";

export const MENU_QUERY = defineQuery(`
  *[_id == "menu"][0]{
    categories[]{
      _key,
      categoryId,
      label,
      urdu,
      note,
      sectionImage{
        asset->{
          url,
          metadata{ lqip, dimensions{ width, height } }
        },
        hotspot,
        crop
      },
      dishes[]{
        _key,
        name,
        urdu,
        desc,
        price,
        priceTiers[]{ _key, label, price },
        spice,
        signature,
        image{
          asset->{
            url,
            metadata{ lqip, dimensions{ width, height } }
          },
          hotspot,
          crop
        },
        featured,
        featuredOrder
      }
    }
  }
`);

export const SITE_PHOTOS_QUERY = defineQuery(`
  *[_id == "sitePhotos"][0]{
    photos[]{
      _key,
      key,
      caption,
      image{
        asset->{
          url,
          metadata{ lqip, dimensions{ width, height } }
        },
        alt,
        hotspot,
        crop
      }
    }
  }
`);

export const CATERING_PACKAGES_QUERY = defineQuery(`
  *[_id == "cateringPackages"][0]{
    packages[]{
      _key,
      name,
      pricePerPerson,
      featured,
      items
    }
  }
`);

export const GALLERY_QUERY = defineQuery(`
  *[_id == "galleryPage"][0]{
    tiles[]{
      _key,
      _type,
      _type == "galleryPhotoTile" => {
        role,
        image{
          asset->{
            url,
            metadata{ lqip, dimensions{ width, height } }
          },
          alt,
          hotspot,
          crop
        }
      },
      _type == "galleryQuoteTile" => {
        role,
        text
      }
    }
  }
`);
