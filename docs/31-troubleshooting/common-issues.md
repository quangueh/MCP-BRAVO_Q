# Common Issues Catalog

## 1. DB Connection Failed

- **Symptoms**: Cannot connect, timeout error
- **Cause**: Wrong server/port/credentials, firewall, VPN
- **Solution**: Check connection settings, verify firewall rules, ensure VPN is connected

## 2. Layout Not Loading

- **Symptoms**: Blank layout, parse error
- **Cause**: Wrong XML encoding, file permissions
- **Solution**: Check XML encoding (UTF-8), verify file read permissions

## 3. Generation Fails

- **Symptoms**: Empty output, template error
- **Cause**: Template files missing, incomplete metadata
- **Solution**: Check template files exist, refresh schema metadata

## 4. Export Fails

- **Symptoms**: Cannot write file
- **Cause**: Insufficient disk space, write permissions
- **Solution**: Check disk space, verify folder write permissions

## 5. App Slow

- **Symptoms**: Long load times, UI lag
- **Cause**: Large cache, memory issues
- **Solution**: Clear cache, restart app, check available memory

## 6. XML Invalid

- **Symptoms**: Bravo import rejects XML
- **Cause**: Format incompatibility
- **Solution**: Check Bravo format compatibility, verify XML structure

## 7. SP Not Found

- **Symptoms**: Stored procedure not in results
- **Cause**: Wrong database name (e.g., `Bravo_Config` vs `Bravo_Data`)
- **Solution**: Verify correct database name in connection settings

## 8. Colors Wrong

- **Symptoms**: Layout colors differ from expected
- **Cause**: Style mapping rule mismatch
- **Solution**: Check style mapping rules in configuration
