# Angular Best Practices & Code Quality Standards
## Enforced During ExtJS to Angular Migration v2.0

### Overview

This document outlines the best practices and code quality standards enforced by the Migration Agent v2.0. All generated Angular code adheres to these standards automatically.

---

## 📋 Table of Contents

1. [TypeScript Standards](#typescript-standards)
2. [Angular Architecture](#angular-architecture)
3. [Modularity & Organization](#modularity--organization)
4. [Memory Management](#memory-management)
5. [Error Handling](#error-handling)
6. [Performance](#performance)
7. [Naming Conventions](#naming-conventions)
8. [Documentation](#documentation)
9. [Testing](#testing)
10. [Code Quality Checklist](#code-quality-checklist)

---

## 🔷 TypeScript Standards

### Strict Typing

**Rule**: Never use `any` type. Always use specific, well-defined types.

```typescript
// ❌ BAD - Using 'any'
function processData(data: any): any {
  return data.value;
}

// ✅ GOOD - Specific typing
interface DataObject {
  value: string;
  timestamp: Date;
}

function processData(data: DataObject): string {
  return data.value;
}
```

### Value Objects and Interfaces

**Rule**: Define interfaces for all data structures used in the application.

```typescript
// Define interfaces for data structures
interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  createdAt: Date;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  action: string;
  resource: string;
}

// Use them strictly
const users: User[] = [];
const currentUser: User | null = null;
```

### Type Guards and Assertions

**Rule**: Use type guards and never force type assertions with `as`.

```typescript
// ❌ AVOID - Unsafe assertion
const userId = (data as any).user.id;

// ✅ GOOD - Type guard
function isUserData(obj: unknown): obj is UserData {
  return typeof obj === 'object' && obj !== null && 'user' in obj;
}

if (isUserData(data)) {
  const userId = data.user.id;
}
```

---

## 🏛️ Angular Architecture

### Component Structure

**Rule**: Keep components focused on UI rendering and user interaction.

```typescript
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,  // ← Important for performance
  standalone: true,  // ← Modern Angular approach
})
export class UserListComponent implements OnInit, OnDestroy {
  // Input properties
  @Input() users: User[] = [];
  @Output() userSelected = new EventEmitter<User>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Initialize component
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
  }
}
```

### Dependency Injection

**Rule**: All dependencies must be injected via constructor, never instantiated directly.

```typescript
// ❌ BAD - Direct instantiation
export class UserComponent {
  private service = new UserService();  // ❌ No
}

// ✅ GOOD - Dependency injection
@Injectable({ providedIn: 'root' })
export class UserService {}

@Component({...})
export class UserComponent {
  constructor(private userService: UserService) {}  // ✅ Yes
}
```

### Service Layer

**Rule**: Services handle business logic; components handle UI logic.

```typescript
// Services (Business logic)
@Injectable({ providedIn: 'root' })
export class UserService {
  private users$ = new BehaviorSubject<User[]>([]);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
}

// Components (UI logic)
@Component({...})
export class UserListComponent {
  users$ = this.userService.getUsers();

  constructor(private userService: UserService) {}

  onUserSelect(user: User) {
    this.userService.getUserById(user.id).subscribe(updatedUser => {
      // Handle selection
    });
  }
}
```

---

## 📦 Modularity & Organization

### Feature Modules

**Rule**: Group related features into feature modules.

```typescript
// users/users.module.ts
@NgModule({
  imports: [CommonModule, SharedModule, UsersRoutingModule],
  declarations: [UserListComponent, UserDetailComponent],
  providers: [UserService],
})
export class UsersModule {}
```

### Shared Module

**Rule**: Place truly shared utilities in a shared module.

```typescript
// shared/shared.module.ts
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Shared components
    LoadingSpinnerComponent,
    // Shared pipes
    CurrencyPipe,
    // Shared directives
    HighlightDirective,
  ],
})
export class SharedModule {}
```

### Avoid Circular Dependencies

**Rule**: Never have circular imports between modules.

```typescript
// ❌ CIRCULAR: UsersModule imports ProductsModule, ProductsModule imports UsersModule
// ✅ SOLUTION: Move shared code to SharedModule

// shared/models/index.ts
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  name: string;
}

export interface Product extends BaseEntity {
  name: string;
}
```

---

## 🔄 Memory Management

### Subscription Management

**Rule**: Always unsubscribe from observables in `ngOnDestroy`.

```typescript
export class UserListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))  // ← Key: takeUntil pattern
      .subscribe(users => this.users = users);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Async Pipe (Recommended)

**Rule**: Prefer async pipe to handle subscriptions automatically.

```typescript
// ✅ BEST: Using async pipe (auto-unsubscribe)
@Component({
  template: `
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
    </div>
  `,
})
export class UserListComponent {
  users$ = this.userService.getUsers();
  constructor(private userService: UserService) {}
}
```

---

## ❌ Error Handling

### HTTP Error Handling

**Rule**: All HTTP calls must have error handling.

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }
}
```

### Component Error Handling

**Rule**: Handle errors in components gracefully.

```typescript
@Component({...})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
      }
    );
  }
}
```

---

## ⚡ Performance

### Change Detection Strategy

**Rule**: Use `OnPush` change detection for better performance.

```typescript
@Component({
  selector: 'app-user-card',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,  // ← Add this
})
export class UserCardComponent {
  @Input() user: User;  // Only updates when input changes
}
```

### Lazy Loading

**Rule**: Lazy load feature modules for better initial load time.

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module')
      .then(m => m.UsersModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module')
      .then(m => m.ProductsModule)
  },
];
```

### TrackBy Function

**Rule**: Use `trackBy` in `*ngFor` for list performance.

```typescript
@Component({
  template: `
    <div *ngFor="let user of users; trackBy: trackByUserId">
      {{ user.name }}
    </div>
  `,
})
export class UserListComponent {
  users: User[] = [];

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
```

---

## 📝 Naming Conventions

### Files and Directories

| Element | Convention | Example |
|---------|-----------|---------|
| Feature module | kebab-case | `user-list.module.ts` |
| Component | kebab-case | `user-card.component.ts` |
| Service | kebab-case | `user.service.ts` |
| Model/Interface | kebab-case | `user.model.ts` |
| Directive | kebab-case | `highlight.directive.ts` |
| Pipe | kebab-case | `custom-currency.pipe.ts` |
| Folder | kebab-case | `/src/app/modules/user-management` |

### Classes and Variables

| Element | Convention | Example |
|---------|-----------|---------|
| Component class | PascalCase + Component | `UserCardComponent` |
| Service class | PascalCase + Service | `UserService` |
| Interface/Model | PascalCase | `User`, `UserDto` |
| Enum | PascalCase | `UserRole`, `Status` |
| Variable | camelCase | `userData`, `isLoading` |
| Constant | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE`, `API_KEY` |
| Subject/Observable | camelCase + $ | `users$`, `loading$` |

---

## 📖 Documentation

### JSDoc Comments

**Rule**: Document all public methods and complex logic.

```typescript
/**
 * Fetches users from the API with optional filtering.
 *
 * @param filter Optional filter criteria
 * @returns Observable of User array
 * @throws Error if API call fails
 *
 * @example
 * userService.getUsers({ role: 'admin' }).subscribe(users => {
 *   console.log(users);
 * });
 */
public getUsers(filter?: UserFilter): Observable<User[]> {
  // Implementation
}
```

### README Files

**Rule**: Each feature module should have a README.

```markdown
# Users Module

User management feature including user list, detail, creation, and editing.

## Components
- UserListComponent
- UserDetailComponent
- UserEditComponent

## Services
- UserService

## Models
- User
- UserDto
```

---

## 🧪 Testing

### Component Testing

**Rule**: Components should be testable (no direct dependencies on services).

```typescript
@Component({...})
export class UserListComponent {
  @Input() users: User[] = [];  // Accept via input (easy to test)
  
  selectUser(user: User) {
    // Should work without service if possible
  }
}

// In tests
it('should select user when clicked', () => {
  const component = TestBed.createComponent(UserListComponent);
  component.componentInstance.users = [mockUser];
  component.detectChanges();

  component.componentInstance.selectUser(mockUser);
  expect(component.componentInstance.selectedUser).toBe(mockUser);
});
```

### Service Testing

**Rule**: Services should be tested with mocked dependencies.

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch users', () => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);
  });
});
```

---

## ✅ Code Quality Checklist

Before committing/deploying, verify:

### TypeScript
- [ ] No `any` types used
- [ ] All variables are properly typed
- [ ] Interfaces defined for all data structures
- [ ] Type guards used where needed

### Architecture
- [ ] Components in `components/` folder
- [ ] Services in `services/` folder
- [ ] Models in `models/` folder
- [ ] Proper dependency injection used
- [ ] Services marked with `@Injectable()`

### Modularity
- [ ] No circular imports
- [ ] Shared code in SharedModule
- [ ] Feature modules properly organized
- [ ] Lazy loading configured

### Memory
- [ ] No memory leaks (subscriptions cleaned up)
- [ ] `ngOnDestroy` implemented where needed
- [ ] `takeUntil` or async pipe used

### Error Handling
- [ ] All HTTP calls have error handling
- [ ] User-facing errors handled
- [ ] Error messages logged

### Performance
- [ ] `ChangeDetectionStrategy.OnPush` used
- [ ] `trackBy` used in `*ngFor`
- [ ] Lazy loading implemented
- [ ] No unnecessary re-renders

### Naming
- [ ] Files follow kebab-case convention
- [ ] Classes follow PascalCase convention
- [ ] Variables follow camelCase convention
- [ ] Subjects/Observables named with `$` suffix

### Documentation
- [ ] Public methods documented with JSDoc
- [ ] Complex logic explained with comments
- [ ] README present in module
- [ ] Usage examples provided

### Testing
- [ ] Components testable without service dependencies
- [ ] Services tested with mocked HTTP
- [ ] At least 80% code coverage
- [ ] Error scenarios tested

---

## 📊 Quality Metrics

The Migration Agent v2.0 validates and scores your code on:

| Metric | Target | Impact |
|--------|--------|--------|
| Typescript Strictness | 95%+ | Type safety |
| Error Handling | 90%+ | Reliability |
| OnDestroy Pattern | 100% | Memory leaks |
| Change Detection | 85%+ | Performance |
| Reactive Programming | 90%+ | Responsiveness |
| Lazy Loading | 80%+ | Load time |
| Naming Conventions | 100% | Readability |
| Documentation | 85%+ | Maintainability |
| Testing Ready | 90%+ | Quality |
| **Overall Score** | **85%+** | **Production Ready** |

---

## 🚀 Production Readiness

An application is production-ready when it achieves:

✅ **Code Quality Score**: 85%+ across all metrics  
✅ **Zero Critical Issues**: No type errors or memory leaks  
✅ **Complete Error Handling**: All error paths handled  
✅ **Performance Optimized**: Load time < 3s (first contentful paint)  
✅ **Security Hardened**: Input validation, XSS protection  
✅ **Fully Tested**: >80% code coverage  
✅ **Well Documented**: All public APIs documented  
✅ **Accessibility Compliant**: WCAG 2.1 Level AA  

---

## 📚 Resources

- [Angular Official Best Practices](https://angular.io/guide/styleguide)
- [RxJS Best Practices](https://rxjs.dev/guide/operators)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Angular Performance](https://angular.io/guide/performance-best-practices)

---

**Last Updated**: February 26, 2024  
**Version**: 2.0  
**Standard**: Production Ready
