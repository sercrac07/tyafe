# Tyafe TODO list

## Global

- [ ] Improve error and informative messages
- [x] Remove unnecessary `deepCopy`
- [x] Fix naming inconsistencies
- [ ] Validation bottleneck
- [ ] Improve schemas configuration
- [x] Add exports for each `Tyafe` schema class

## Tests

### Structure

- [x] Group schemas by type

### Async Testing

- [x] Create comprehensive async test suite (parseAsync, safeParseAsync)
- [x] Add async validation and processing tests
- [x] Implement async transformation testing

### Performance & Memory Testing  

- [x] Implement memory leak detection tests
- [x] Create deep nesting performance tests (>10 levels)
- [x] Add deep schema chain performance tests

### Error Handling Testing

- [x] Implement custom error message testing
- [x] Add error code validation tests
- [x] Create multiple error collection tests
- [x] Implement nested error path tracing

### Data Type Edge Cases

- [x] Add special number value tests (NaN, Infinity, -Infinity, -0)
- [x] Implement invalid date boundary testing
- [x] Add timezone boundary tests
- [x] Create date overflow scenario tests

### Schema Composition Testing

- [x] Add recursive schema testing (circular references)
- [x] Create complex union/intersection chain tests
- [x] Implement enhanced deep nesting scenarios
- [x] Add advanced schema composition testing
- [x] Create complex combined schema tests

## TyafeBase

- [x] Control the usage of deep copy

## TyafeString

- [ ] Add more validators:
  - [ ] `uuid`
  - [ ] `json`
- [ ] Add allowed protocols on `url` validation

## TyafeNumber

- [ ] Missing special number value handling
- [ ] Add more validators:
  - [ ] `safeInteger`
  - [ ] `step`

*This TODO list is maintained as part of the TyafeBase development roadmap. Items are prioritized based on impact, effort, and dependencies. Regular reviews should be conducted to adjust priorities based on changing requirements and feedback.*
