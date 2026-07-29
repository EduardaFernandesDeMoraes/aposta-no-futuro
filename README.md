# Aposta no Futuro

Crie um aplicativo mobile-first (formato de celular) chamado "Aposta no Futuro". É um app social e educativo, em português do Brasil, que ajuda jovens a prevenir e enfrentar o vício em apostas online (bets). O público são jovens de 15 a 24 anos, muitos de baixa renda. O tom é ACOLHEDOR, JOVEM, ESPERANÇOSO e SEM JULGAMENTO. Nunca culpe o usuário. Trate a pessoa por "você".

IDENTIDADE VISUAL (use exatamente estas cores):

- Fundo claro: #F7FAFC

- Azul-marinho (títulos, textos fortes, barra de navegação): #16233C

- Verde-água / teal (cor principal das ações positivas e botões): #16BFAC

- Coral (alertas e botão de ajuda): #FF5B4C

- Rosa/magenta (destaques): #E8197E

- Dourado (conquistas e medalhas): #F5A623

- Ciano (informações): #1CA0D8

Fonte: Poppins. Visual com cantos arredondados, cards com sombra suave, amigável mas não infantil.

NAVEGAÇÃO: uma barra inferior fixa com 5 abas: "Início", "Simulador", "Comunidade", "Desafios" e "Perfil". No topo de todas as telas, deixe SEMPRE VISÍVEL um botão vermelho pequeno escrito "Preciso de ajuda". Deixe também um botão flutuante de chat (círculo teal) no canto inferior direito, que abre um assistente virtual.

DADOS: não exija login nem senha. Use o armazenamento local do navegador (localStorage) para lembrar as informações do usuário entre as sessões (nome, data do primeiro dia livre, valores do simulador, desafios concluídos). Comece com dados de exemplo (mock) onde fizer sentido.

REGRAS DE RESPONSABILIDADE (muito importante, aplique em todo o app):

- O app NÃO substitui tratamento profissional; em qualquer tela sensível, ofereça o CVV (ligar 188) e os CAPS.

- NUNCA incentive apostar. Nunca mostre marcas de casas de apostas, odds reais ou links para apostar.

- Trate recaída com acolhimento, nunca com culpa.

TELA DE ABERTURA (onboarding): 3 telas curtas de boas-vindas explicando, de forma simples e motivadora, o que o app faz ("acompanhe seus dias livres", "veja quanto você economiza", "não caminhe sozinho"). Na última, peça (de forma opcional) o primeiro nome e a data do "meu primeiro dia livre de apostas". Depois, leve para a aba "Início".

Por enquanto, crie a estrutura, a navegação e as telas vazias. Vamos preencher cada uma nos próximos passos.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aposta-no-futuro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aadf69c0-1500-42b5-994b-069f742bb975).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
