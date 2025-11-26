# 📝 Padrões de Código - Projeto Cirurgião

## Status
✅ **APROVADO** - 09/11/2025

## Visão Geral

Este documento define os padrões de código, convenções e boas práticas para todo o Projeto Cirurgião. Todos os desenvolvedores devem seguir estas diretrizes para manter consistência e qualidade do código.

## Princípios Gerais

1. **Clean Code**: Código limpo, legível e auto-explicativo
2. **DRY (Don't Repeat Yourself)**: Evitar duplicação de código
3. **SOLID**: Seguir princípios SOLID de design
4. **KISS (Keep It Simple, Stupid)**: Simplicidade sobre complexidade
5. **YAGNI (You Aren't Gonna Need It)**: Não implementar funcionalidades desnecessárias

## TypeScript / JavaScript

### Configuração

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@modules/*": ["./modules/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

### Convenções de Nomenclatura

```typescript
// ✅ BOM
// Classes: PascalCase
class UserService {}
class VideoController {}

// Interfaces: PascalCase com prefixo I (opcional)
interface User {}
interface IVideoMetadata {}

// Types: PascalCase
type UserRole = 'ADMIN' | 'STUDENT';

// Variáveis e funções: camelCase
const userName = 'John';
function getUserById(id: string) {}

// Constantes: UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB
const API_BASE_URL = 'https://api.example.com';

// Arquivos: kebab-case
// user-service.ts
// video-controller.ts
// auth-middleware.ts

// ❌ RUIM
class user_service {} // Não use snake_case para classes
const UserName = 'John'; // Não use PascalCase para variáveis
function GetUserById() {} // Não use PascalCase para funções
```

### Estrutura de Arquivos

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── tests/
│   │       ├── auth.controller.spec.ts
│   │       └── auth.service.spec.ts
│   └── users/
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.repository.ts
│       ├── users.module.ts
│       ├── entities/
│       │   └── user.entity.ts
│       └── dto/
│           ├── create-user.dto.ts
│           └── update-user.dto.ts
├── shared/
│   ├── interfaces/
│   ├── utils/
│   ├── constants/
│   └── decorators/
└── main.ts
```

### Imports

```typescript
// ✅ BOM - Ordem de imports
// 1. Node modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// 2. Módulos internos (com linha em branco)
import { User } from '@/modules/users/entities/user.entity';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';

// 3. Tipos e interfaces
import type { Repository } from 'typeorm';

// ❌ RUIM - Imports desorganizados
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
```

### Funções e Métodos

```typescript
// ✅ BOM
/**
 * Busca um usuário pelo ID
 * @param id - ID do usuário
 * @returns Promise com o usuário encontrado
 * @throws NotFoundException se usuário não existir
 */
async function getUserById(id: string): Promise<User> {
  const user = await userRepository.findOne({ where: { id } });
  
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  
  return user;
}

// Funções pequenas e focadas (< 20 linhas)
function calculateDiscount(price: number, percentage: number): number {
  return price * (percentage / 100);
}

// ❌ RUIM
// Função muito grande e com múltiplas responsabilidades
async function processUser(data: any) {
  // 100+ linhas de código
  // Validação, criação, envio de email, logging, etc.
}

// Sem tipagem
function getUser(id) {
  return userRepository.findOne(id);
}
```

### Async/Await

```typescript
// ✅ BOM
async function fetchUserData(userId: string): Promise<UserData> {
  try {
    const user = await userService.findById(userId);
    const courses = await courseService.findByUserId(userId);
    const progress = await progressService.findByUserId(userId);
    
    return {
      user,
      courses,
      progress,
    };
  } catch (error) {
    logger.error('Error fetching user data', { userId, error });
    throw new InternalServerErrorException('Failed to fetch user data');
  }
}

// ❌ RUIM - Callback hell
function fetchUserData(userId, callback) {
  userService.findById(userId, (err, user) => {
    if (err) return callback(err);
    courseService.findByUserId(userId, (err, courses) => {
      if (err) return callback(err);
      // ...
    });
  });
}
```

### Error Handling

```typescript
// ✅ BOM
class UserService {
  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      // Validação
      await this.validateEmail(dto.email);
      
      // Criação
      const user = await this.userRepository.create(dto);
      
      // Log de sucesso
      this.logger.log(`User created: ${user.id}`);
      
      return user;
    } catch (error) {
      // Log de erro com contexto
      this.logger.error('Failed to create user', {
        dto,
        error: error.message,
        stack: error.stack,
      });
      
      // Re-throw com erro apropriado
      if (error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}

// ❌ RUIM
async createUser(dto: any) {
  try {
    return await this.userRepository.create(dto);
  } catch (error) {
    console.log(error); // Não use console.log
    throw error; // Não re-throw erro genérico
  }
}
```

## React / Next.js

### Componentes

```typescript
// ✅ BOM - Componente funcional com TypeScript
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}

export function UserCard({ user, onEdit, className }: UserCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    onEdit?.(user);
  }, [user, onEdit]);
  
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-sm text-muted-foreground">{user.email}</p>
      
      {onEdit && (
        <Button onClick={handleEdit} variant="outline" size="sm">
          Editar
        </Button>
      )}
    </div>
  );
}

// ❌ RUIM
export default function UserCard(props: any) {
  return (
    <div>
      <h3>{props.user.name}</h3>
      <p>{props.user.email}</p>
      <button onClick={() => props.onEdit(props.user)}>Editar</button>
    </div>
  );
}
```

### Hooks

```typescript
// ✅ BOM - Custom hook
interface UseUserDataReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUserData(userId: string): UseUserDataReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.users.getById(userId);
      setUser(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  return { user, loading, error, refetch: fetchUser };
}

// Uso
function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error, refetch } = useUserData(userId);
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;
  
  return <UserCard user={user} onEdit={refetch} />;
}
```

### Server Components vs Client Components

```typescript
// ✅ BOM - Server Component (padrão no Next.js 14)
// app/users/page.tsx
import { getUsersFromDatabase } from '@/lib/database';

export default async function UsersPage() {
  const users = await getUsersFromDatabase();
  
  return (
    <div>
      <h1>Usuários</h1>
      <UserList users={users} />
    </div>
  );
}

// ✅ BOM - Client Component (quando necessário)
// components/user-list.tsx
'use client';

import { useState } from 'react';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const [filter, setFilter] = useState('');
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filtrar usuários..."
      />
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

## Swift (iOS)

### Convenções

```swift
// ✅ BOM
// Classes e Structs: PascalCase
class UserService {}
struct User {}

// Variáveis e funções: camelCase
let userName = "John"
func getUserById(id: String) -> User? {}

// Constantes: camelCase (não UPPER_CASE)
let maxUploadSize = 100 * 1024 * 1024

// Enums: PascalCase
enum UserRole {
    case admin
    case student
    case instructor
}

// Protocols: PascalCase com sufixo "able" ou "Protocol"
protocol Cacheable {}
protocol UserServiceProtocol {}
```

### MVVM Pattern

```swift
// ✅ BOM - Model
struct User: Codable, Identifiable {
    let id: String
    let name: String
    let email: String
    let role: UserRole
}

// ✅ BOM - ViewModel
@MainActor
class UserViewModel: ObservableObject {
    @Published var user: User?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let userService: UserServiceProtocol
    
    init(userService: UserServiceProtocol = UserService()) {
        self.userService = userService
    }
    
    func loadUser(id: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            user = try await userService.getUser(id: id)
        } catch {
            errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
}

// ✅ BOM - View
struct UserProfileView: View {
    @StateObject private var viewModel = UserViewModel()
    let userId: String
    
    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView()
            } else if let user = viewModel.user {
                UserDetailView(user: user)
            } else if let error = viewModel.errorMessage {
                ErrorView(message: error)
            }
        }
        .task {
            await viewModel.loadUser(id: userId)
        }
    }
}
```

## Kotlin (Android)

### Convenções

```kotlin
// ✅ BOM
// Classes: PascalCase
class UserService {}
data class User()

// Variáveis e funções: camelCase
val userName = "John"
fun getUserById(id: String): User? {}

// Constantes: UPPER_SNAKE_CASE (em companion object)
companion object {
    const val MAX_UPLOAD_SIZE = 100 * 1024 * 1024
    const val API_BASE_URL = "https://api.example.com"
}

// Sealed classes para estados
sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}
```

### MVVM Pattern

```kotlin
// ✅ BOM - Model
data class User(
    val id: String,
    val name: String,
    val email: String,
    val role: UserRole
)

// ✅ BOM - ViewModel
class UserViewModel(
    private val userRepository: UserRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<UiState<User>>(UiState.Loading)
    val uiState: StateFlow<UiState<User>> = _uiState.asStateFlow()
    
    fun loadUser(userId: String) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            
            try {
                val user = userRepository.getUser(userId)
                _uiState.value = UiState.Success(user)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}

// ✅ BOM - Composable
@Composable
fun UserProfileScreen(
    userId: String,
    viewModel: UserViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    LaunchedEffect(userId) {
        viewModel.loadUser(userId)
    }
    
    when (val state = uiState) {
        is UiState.Loading -> LoadingIndicator()
        is UiState.Success -> UserDetailView(user = state.data)
        is UiState.Error -> ErrorView(message = state.message)
    }
}
```

## Git

### Commits

```bash
# ✅ BOM - Conventional Commits
feat: add user authentication
fix: resolve video buffering issue
docs: update API documentation
style: format code with prettier
refactor: simplify user service logic
test: add unit tests for auth service
chore: update dependencies

# Com escopo
feat(auth): implement JWT refresh token
fix(video): resolve playback on iOS
docs(api): add endpoint documentation

# Com breaking change
feat(api)!: change user endpoint structure

BREAKING CHANGE: User endpoint now returns different format

# ❌ RUIM
Update stuff
Fixed bug
WIP
asdfasdf
```

### Branches

```bash
# ✅ BOM
main                    # Produção
develop                 # Desenvolvimento
feature/user-auth       # Nova feature
fix/video-buffering     # Correção de bug
hotfix/critical-error   # Correção urgente
release/v1.0.0          # Release

# ❌ RUIM
my-branch
test
temp
branch1
```

### Pull Requests

```markdown
# ✅ BOM - Template de PR

## Descrição
Implementa autenticação JWT com refresh tokens

## Tipo de mudança
- [x] Nova feature
- [ ] Correção de bug
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [x] Código segue os padrões do projeto
- [x] Testes unitários adicionados/atualizados
- [x] Documentação atualizada
- [x] Build passa sem erros
- [x] Sem conflitos com a branch base

## Screenshots (se aplicável)
[Adicionar screenshots]

## Testes
- Testado localmente
- Testes unitários passando
- Testes de integração passando

## Relacionado
Closes #123
Related to #456
```

## Testes

### Estrutura de Testes

```typescript
// ✅ BOM - Testes bem estruturados
describe('UserService', () => {
  let service: UserService;
  let repository: MockType<Repository<User>>;
  
  beforeEach(() => {
    repository = createMockRepository();
    service = new UserService(repository);
  });
  
  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const dto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };
      
      const expectedUser = {
        id: '123',
        ...dto,
      };
      
      repository.create.mockResolvedValue(expectedUser);
      
      // Act
      const result = await service.createUser(dto);
      
      // Assert
      expect(result).toEqual(expectedUser);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
    
    it('should throw ConflictException if email already exists', async () => {
      // Arrange
      const dto: CreateUserDto = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'password123',
      };
      
      repository.create.mockRejectedValue(
        new ConflictException('Email already exists')
      );
      
      // Act & Assert
      await expect(service.createUser(dto)).rejects.toThrow(
        ConflictException
      );
    });
  });
});
```

### Cobertura de Testes

```yaml
Targets:
  Backend: > 80%
  Frontend: > 70%
  Mobile: > 70%

Prioridades:
  1. Lógica de negócio (100%)
  2. Services e repositories (90%)
  3. Controllers e endpoints (80%)
  4. Components e views (70%)
  5. Utils e helpers (80%)
```

## Documentação

### JSDoc / TSDoc

```typescript
/**
 * Serviço responsável por gerenciar usuários
 * 
 * @example
 * ```typescript
 * const userService = new UserService(userRepository);
 * const user = await userService.createUser(dto);
 * ```
 */
@Injectable()
export class UserService {
  /**
   * Cria um novo usuário
   * 
   * @param dto - Dados do usuário a ser criado
   * @returns Promise com o usuário criado
   * @throws {ConflictException} Se o email já existir
   * @throws {BadRequestException} Se os dados forem inválidos
   * 
   * @example
   * ```typescript
   * const user = await userService.createUser({
   *   email: 'user@example.com',
   *   name: 'John Doe',
   *   password: 'securePassword123'
   * });
   * ```
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    // Implementation
  }
}
```

## Code Review

### Checklist do Revisor

```markdown
## Funcionalidade
- [ ] O código faz o que deveria fazer?
- [ ] Os casos de erro estão tratados?
- [ ] Os edge cases foram considerados?

## Qualidade
- [ ] O código é legível e auto-explicativo?
- [ ] Segue os padrões do projeto?
- [ ] Não há código duplicado?
- [ ] Funções são pequenas e focadas?

## Testes
- [ ] Testes foram adicionados/atualizados?
- [ ] Cobertura de testes é adequada?
- [ ] Testes são claros e significativos?

## Performance
- [ ] Não há problemas óbvios de performance?
- [ ] Queries de banco estão otimizadas?
- [ ] Não há N+1 queries?

## Segurança
- [ ] Inputs são validados?
- [ ] Não há vulnerabilidades óbvias?
- [ ] Dados sensíveis estão protegidos?

## Documentação
- [ ] Código complexo está documentado?
- [ ] README foi atualizado se necessário?
- [ ] API docs foram atualizadas?
```

## Ferramentas

### Linters e Formatters

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}

// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --bail --findRelatedTests"
    ]
  }
}
```

## Revisão e Aprovação

- **Autor**: TECH-LEAD-01 (Ricardo)
- **Revisores**: Todos os desenvolvedores
- **Data de Aprovação**: 09/11/2025

## Referências

- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/)
- [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html)

---

**Última Atualização**: 09/11/2025  
**Versão**: 1.0
