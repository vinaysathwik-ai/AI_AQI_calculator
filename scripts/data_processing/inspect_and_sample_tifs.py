"""
Script to inspect GeoTIFF metadata, CRS, bounds, nodata, and statistics for Sentinel-5P files.
"""
import glob
import os
import rasterio
import numpy as np

def inspect_tif_files():
    tif_files = sorted(glob.glob("*.tif") + glob.glob("*.tiff"))
    print(f"Found {len(tif_files)} GeoTIFF files:")
    
    for path in tif_files:
        print("\n" + "=" * 60)
        print(f"File: {path}")
        with rasterio.open(path) as src:
            print(f"  Driver:       {src.driver}")
            print(f"  Dimensions:   Width={src.width}, Height={src.height}, Bands={src.count}")
            print(f"  CRS:          {src.crs}")
            print(f"  Transform:    {src.transform}")
            print(f"  Bounds:       {src.bounds}")
            print(f"  NoData:       {src.nodatavals}")
            
            # Read first band
            band1 = src.read(1)
            nodata = src.nodata
            
            if nodata is not None:
                valid_mask = (band1 != nodata) & (~np.isnan(band1))
            else:
                valid_mask = ~np.isnan(band1)
                
            valid_vals = band1[valid_mask]
            
            if len(valid_vals) > 0:
                print(f"  Valid pixels: {len(valid_vals)} / {band1.size} ({len(valid_vals)/band1.size*100:.1f}%)")
                print(f"  Min Value:    {valid_vals.min():.6e}")
                print(f"  Max Value:    {valid_vals.max():.6e}")
                print(f"  Mean Value:   {valid_vals.mean():.6e}")
                print(f"  Median Value: {np.median(valid_vals):.6e}")
                print(f"  Std Dev:      {valid_vals.std():.6e}")
            else:
                print("  No valid data pixels found!")

if __name__ == "__main__":
    inspect_tif_files()
