# Offline domain

This directory will contain På Jobb's application-owned offline model: local records, mutation queue, sync metadata and conflict handling.

Do not make business/domain code depend directly on Dexie-specific types. Dexie is an implementation helper around IndexedDB, not the product architecture.
