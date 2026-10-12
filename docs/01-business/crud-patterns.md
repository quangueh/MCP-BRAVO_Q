# CRUD Pattern Analysis

## INSERT
INSERT INTO table (cols) VALUES (@vals) - set IsActive=1, audit columns

## UPDATE
UPDATE table SET col=@val, ModifiedBy=@_UserId, ModifiedDate=GETDATE() WHERE Id=@Id

## DELETE (Soft)
UPDATE table SET IsActive=0, ModifiedBy=@_UserId, ModifiedDate=GETDATE() WHERE Id=@Id

## SELECT
SELECT t.cols FROM table t LEFT JOIN master m ON t.FK=m.Id WHERE t.IsActive=1
