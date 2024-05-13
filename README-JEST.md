# JEST
## Introdução
Jest é um framework de testes para JavaScript, desenvolvido pelo Facebook. Ele é projetado para ser simples de configurar e usar, enquanto fornece recursos poderosos para testar código JavaScript, incluindo aplicações Angular, React, Node.js, bibliotecas e muito mais.

## Configurar Jest no Angular
**Remover Jasmine e Karma:**
```sh
$ npm uninstall jasmine-core @types/jasmine karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
```

**Instalar Jest**
```sh
npm i --save-dev @angular-builders/jest jest @types/jest jest-preset-angular
```

**Abra o arquivo *angular.json* procure por "test": { ... } e substitua para:**
```json
"test": {
  "builder": "@angular-builders/jest:run"
  "options": {
    "polyfills": [
      "zone.js",
      "zone.js/testing"
    ],
    "tsConfig": "tsconfig.spec.json"
  }
}
```

**Crie o arquivo *tsconfig.spec.json* e coloque:**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "module": "CommonJs",
    "types": [
      "jest",
      "node"
    ]
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

**Crie o arquivo *setup-jest.ts* e coloque:**
```ts
/** @type {import('jest-preset-angular')} */
```

**Crie o arquivo *jest.config.js* e coloque:**
```ts
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts']
};
```

**Crie o arquivo *package.json* e coloque:**
```json
"scripts": {
  ...
  "test": "jest --clear-cache && ng test --coverage"
  ...
}
```

## Expect, Modifiers and Matchers
> Documentation: https://jestjs.io/pt-BR/docs/expect

|  Expect  | Description |
|----------|-------------|
| expect(value)   | É uma função que possui como propósito definir as expectativas e asserções nos testes. Ela é usada em conjunto com os matchers para realizar as comparações entre valores. Os matchers são responsáveis por conter o valor a ser comparado e são utilizados para criar asserções mais expressivas e legíveis. |

| Modifiers | Description |
|-----------|-------------|
| .not | É usado para inverter a lógica de um matcher. Com isso, testando o seu oposto. |

| Matchers | Description |
|----------|-------------|
| .toBe(valor) | Verifica se um valor primitivo é igual a `valor`. |
| .toHaveBeenCalled() | Verifica se a função foi chamada. |
| .toHaveBeenCalledTimes(numero) | Verifica se a função foi chamada exatamente `numero` vezes. |
| .toHaveBeenCalledWith(args) | Verifica se a função foi chamada com os argumentos especificados. |
| .toHaveBeenLastCalledWith(args) | Verifica se a função foi chamada pela última vez com os argumentos especificados. |
| .toHaveBeenNthCalledWith(nthCall, args) | Verifica se a função foi chamada na n-ésima chamada com os argumentos especificados. |
| .toHaveReturned() | Verifica se a função retornou um valor. |
| .toHaveReturnedTimes(numero) | Verifica se a função retornou um valor exatamente `numero` vezes. |
| .toHaveReturnedWith(valor) | Verifica se a função retornou com um valor estritamente igual a `valor`. |
| .toHaveLastReturnedWith(valor) | Verifica se a função retornou com um valor igual a `valor` na última chamada. |
| .toHaveNthReturnedWith(nthCall, valor) | Verifica se a função retornou com um valor igual a `valor` na n-ésima chamada. |
| .toHaveLength(numero) | Verifica se o objeto tem um comprimento exato de `numero`. |
| .toHaveProperty(caminhoDaChave, valor?) | Verifica se o objeto tem uma propriedade específica e se uma propriedade tem um valor específico. Propriedade específica: expect(object).toHaveProperty('age'); Valor específico em uma propriedade: expect(object).toHaveProperty('age', 30). |
| .toBeCloseTo(numero, numDigitos?) | Verifica se o valor está próximo do número especificado. Usado em números com ponto flutuante. |
| .toBeDefined() | Verifica se o valor não é `undefined`. |
| .toBeFalsy() | Verifica se o valor é falsy. |
| .toBeGreaterThan(numero) | Verifica se o valor é maior que `numero`. |
| .toBeGreaterThanOrEqual(numero) | Verifica se o valor é maior ou igual a `numero`. |
| .toBeLessThan(numero) | Verifica se o valor é menor que `numero`. |
| .toBeLessThanOrEqual(numero) | Verifica se o valor é menor ou igual a `numero`. |
| .toBeInstanceOf(Classe) | Verifica se o objeto é uma instância de uma classe específica. |
| .toBeNull() | Verifica se o valor é `null`. |
| .toBeTruthy() | Verifica se o valor é truthy. |
| .toBeUndefined() | Verifica se o valor é `undefined`. |
| .toBeNaN() | Verifica se o valor é `NaN`. |
| .toContain(item) | Verifica se o objeto contém `item`. |
| .toContainEqual(item) | Verifica se o objeto contém um item igual a `item`. |
| .toEqual(valor) | Verifica se o objeto é igual a `valor` usando recursão profunda. |
| .toMatch(regexp | string) | Verifica se o valor corresponde ao padrão especificado. |
| .toMatchObject(objeto) | Verifica se o objeto corresponde parcialmente ao objeto especificado. |
| .toMatchSnapshot(matchersDePropriedade?, sugestão?) | Verifica se o valor corresponde ao snapshot (instantâneo) salvo anteriormente. |
| .toMatchInlineSnapshot(matchersDePropriedade?, inlineSnapshot) | Verifica se o valor corresponde ao snapshot (instantâneo) inline salvo anteriormente. |
| .toStrictEqual(valor) | Verifica se o objeto é estritamente igual a `valor`. |
| .toThrow(erro?) | Verifica se uma função lança um erro. |
| .toThrowErrorMatchingSnapshot(sugestão?) | Verifica se a função lança um erro que corresponde ao snapshot (instantâneo) salvo anteriormente. |
| .toThrowErrorMatchingInlineSnapshot(inlineSnapshot) | Verifica se a função lança um erro que corresponde ao snapshot (instantâneo) inline salvo anteriormente. |

## Hooks
| Hooks | Description |
|-------|-------------|
| beforeAll(fn, timeout) | Função que será executada uma vez, antes de todos os testes no bloco de descrição serem executados. | and Spies
| afterAll(fn, timeout) | Função que será executada uma vez, depois que todos os testes no bloco de descrição forem executados. |
| beforeEach(fn, timeout) | Função que será executada antes de cada teste no bloco de descrição ser executado. |
| afterEach(fn, timeout)  | Função que será executada depois de cada teste no bloco de descrição ser executado. |
| beforeAll(async fn, timeout) | Versão assíncrona do `beforeAll`. Função que será executada uma vez, antes de todos os testes no bloco de descrição serem executados. |
| afterAll(async fn, timeout)  | Versão assíncrona do `afterAll`. Função que será executada uma vez, depois que todos os testes no bloco de descrição forem executados. |
| beforeEach(async fn, timeout) | Versão assíncrona do `beforeEach`. Função que será executada antes de cada teste no bloco de descrição ser executado. |
| afterEach(async fn, timeout)  | Versão assíncrona do `afterEach`. Função que será executada depois de cada teste no bloco de descrição ser executado. |

## Mocks and Spies
**Mocks:**
Um mock substitui completamente a função original por uma versão simulada. Mocks são úteis quando você deseja isolar uma parte específica do código para testar seu comportamento sem depender de partes externas do sistema.

```ts
const mockError = {
  "message": "Email is invalid.",
  "isError": true
};
const signInSpy = jest.spyOn(signInService, 'signIn')
                          .mockReturnValue(of(mockError));
```

```ts
const mockError = {
  "message": "Email is invalid.",
  "isError": true
};
const signInSpy = jest.spyOn(signInService, 'signIn')
                          .mockReturnValue(throwError(() => mockError));
```

**Spies:**
É uma funcionalidade que permite criar espiões para observar o comportamento de funções durante a execução dos casos de teste. Esses espiões permitem rastrear se uma função foi chamada, com quais argumentos e quantas vezes. Isso é útil para verificar se o código está se comportando como o esperado e se as funções estão sendo invocadas corretamente durante os testes.

```ts
const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');

ngZone.run(() => {
  component.signOut();
});

expect(navigateByUrlSpy).toHaveBeenCalledWith('/sign-in');
```

## Casos de uso
- Teste como quer que o componente funcione
- Teste como o componente lida com errors
- Teste como o componente lida com exceções
---
- Verificar se o componente de classe foi instanciado corretamente
- Verificar a inicialização dos atributos
- Verificar a modificação de atributos ao interagirem com eles
- Verificar se o método foi chamado 
- Verificar quantas vezes o método foi chamado
- Verificar quais parâmetros o método recebe
- Verificar os retornos positivos dos métodos do componente de classe
- Verificar os retornos negativos dos métodos do componente de classe (errors e exceções)
