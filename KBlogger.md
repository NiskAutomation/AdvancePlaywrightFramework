# Winston Logger Knowledge Base

## Overview
The TTACart framework uses **Winston** for structured logging. The logger provides two primary ways to log:
- **Root Logger** (`logger`): For framework-wide messages
- **Scoped Logger** (`createLogger(scope)`): For component-specific messages with automatic scope labeling

## Logging Levels

Winston uses the following logging levels in order of severity (0-6), with the default level set to **`info`**:

| Level | Severity | Use Case |
|-------|----------|----------|
| **error** | 0 (Highest) | Critical failures and exceptions |
| **warn** | 1 | Warnings and unexpected conditions |
| **info** | 2 | General informational messages (default) |
| **http** | 3 | HTTP request/response details |
| **debug** | 4 | Detailed debugging information |
| **verbose** | 5 | Very detailed diagnostic information |
| **silly** | 6 (Lowest) | Trace-level logging for deep debugging |

---

## Usage Examples

### 1. **ERROR** - Critical Failures
Use for exceptions, failed operations, and system-breaking issues.

```typescript
import { createLogger } from '../utils/logger';
const logger = createLogger('LoginPage');

try {
  // Some operation
} catch (error) {
  logger.error(`Failed to login user: ${error.message}`);
  // Output: 2026-06-02 07:40:01 [error] [LoginPage] Failed to login user: Invalid credentials
}
```

### 2. **WARN** - Warnings & Unexpected Conditions
Use for deprecated features, missing optional data, or recoverable errors.

```typescript
import { createLogger } from '../utils/logger';
const logger = createLogger('CheckoutPage');

if (!user.discountCode) {
  logger.warn('No discount code provided; proceeding without discount');
  // Output: 2026-06-02 07:40:01 [warn] [CheckoutPage] No discount code provided; proceeding without discount
}
```

### 3. **INFO** - General Information
Use for major workflow events, test start/end, and important state changes. **This is the default level.**

```typescript
import { createLogger } from '../utils/logger';
const logger = createLogger('OrderConfirmationPage');

logger.info('Order confirmation received for order #12345');
// Output: 2026-06-02 07:40:01 [info] [OrderConfirmationPage] Order confirmation received for order #12345

logger.info('User successfully logged out');
// Output: 2026-06-02 07:40:01 [info] [LoginPage] User successfully logged out
```

### 4. **HTTP** - HTTP Request/Response Details
Use for API calls, network requests, and their responses.

```typescript
import { createLogger } from '../utils/logger';
const logger = createLogger('APIClient');

logger.http('GET /api/inventory - Status 200');
// Output: 2026-06-02 07:40:01 [http] [APIClient] GET /api/inventory - Status 200

logger.http('POST /api/checkout - Response: {"orderId": "12345"}');
// Output: 2026-06-02 07:40:01 [http] [APIClient] POST /api/checkout - Response: {"orderId": "12345"}
```

### 5. **DEBUG** - Detailed Debugging Information
Use for variable values, control flow, and intermediate steps during troubleshooting.

```typescript
import { createLogger } from '../utils/logger';
const logger = createLogger('CartPage');

logger.debug(`Cart has ${items.length} items with total value $${total}`);
// Output: 2026-06-02 07:40:01 [debug] [CartPage] Cart has 5 items with total value $149.99

logger.debug('Attempting to apply promo code: SUMMER20');
// Output: 2026-06-02 07:40:01 [debug] [CartPage] Attempting to apply promo code: SUMMER20
```

### 6. **VERBOSE** - Very Detailed Diagnostic Information
Use for step-by-step execution traces and internal state inspection.

```typescript
import { createLogger } from '../utils/logger';
const logger = createLogger('InventoryPage');

logger.verbose('Filtering products: brand=Nike, size=10, color=blue');
// Output: 2026-06-02 07:40:01 [verbose] [InventoryPage] Filtering products: brand=Nike, size=10, color=blue

logger.verbose('Page load time: 2.34s, DOM elements: 542');
// Output: 2026-06-02 07:40:01 [verbose] [InventoryPage] Page load time: 2.34s, DOM elements: 542
```

### 7. **SILLY** - Trace-Level Logging
Use for extremely detailed tracing, rarely needed but available for deep debugging.

```typescript
import { createLogger } from '../utils/logger';
const logger = createLogger('BasePage');

logger.silly('Entering method: findElement(selector="#product-123")');
// Output: 2026-06-02 07:40:01 [silly] [BasePage] Entering method: findElement(selector="#product-123")

logger.silly('Stack trace: [main -> checkout -> payment -> verify]');
// Output: 2026-06-02 07:40:01 [silly] [BasePage] Stack trace: [main -> checkout -> payment -> verify]
```

---

## Configuration

### Setting the Log Level
Control the logging verbosity via the **`LOG_LEVEL`** environment variable:

```bash
# Only show errors and warnings
LOG_LEVEL=warn npm run test

# Show all logs including debug information
LOG_LEVEL=debug npm run test

# Show extremely verbose output
LOG_LEVEL=verbose npm run test

# Default: info (if not set)
npm run test
```

### Output Destinations
Logs are written to two places:
1. **Console** - Pretty-printed with colors for easy reading during development
2. **File** - Plain text to `logs/combined.log` for CI/CD artifacts and permanent records

---

## Log Format

All logs follow this format:
```
YYYY-MM-DD HH:mm:ss [LEVEL] [SCOPE] MESSAGE
```

Example:
```
2026-06-02 07:40:01 [info] [LoginPage] clicked #login-button
2026-06-02 07:40:02 [error] [CheckoutPage] Payment processing failed: Card declined
2026-06-02 07:40:03 [debug] [CartPage] Cart item count: 3
```

---

## Best Practices

1. **Use Scoped Loggers**: Always pass the class name when creating loggers
   ```typescript
   const logger = createLogger('LoginPage');  // ✓ Good
   const logger = logger;                      // ✗ Poor - no context
   ```

2. **Log at Appropriate Levels**: Don't use ERROR for warnings or INFO for debug details

3. **Include Context**: Add relevant details to make logs searchable and debuggable
   ```typescript
   logger.info(`Navigated to ${url}`);         // ✓ Good - includes URL
   logger.info('Navigation complete');         // ✗ Poor - no context
   ```

4. **Use Environment Variable**: Adjust LOG_LEVEL without changing code
   ```bash
   LOG_LEVEL=debug npm run test:e2e
   ```

5. **Check CI Logs**: Review `logs/combined.log` after test runs for detailed diagnostics

---

## Root Logger Usage

For framework-wide messages without scope:

```typescript
import { logger } from '../utils/logger';

logger.info('Framework initialization started');
logger.error('Critical framework error occurred');
```

---

## Related Files
- **Logger Implementation**: [src/utils/logger.ts](src/utils/logger.ts)
- **Log Output**: `logs/combined.log`
