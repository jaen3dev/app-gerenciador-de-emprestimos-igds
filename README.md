 ## Tabela de conteúdos
* [Informação Geral](#info-geral)
* [Tecnologias](#tecnologias)
* [Conclusão](#conclusao)

 <h2 id="info-geral">Informação Geral</h2>

 Esse projeto consiste em um aplicativo desktop que realiza o cadastro, listagem e filtro de empréstimos de aparelhos hospitalares.  
 Existe uma necessidade de ter um controle dos aparelhos que são emprestados pelo Instituto Glacia da Silva - Corrente do Bem, as informações sobre os empréstimos estavam dispersas e confusas, causando em perda de dados.  

 Esse aplicativo resolve isso. Ao cadastrar um empréstimo é solicitado informações pertinentes ao responsável pelo aparelho, permitindo assim um futuro contato com o mesmo.

 ![app-igds](https://github.com/jaen3dev/app-gerenciador-de-emprestimos-igds/assets/152646582/707b87c0-29a2-4655-b3d2-ad1a62678ef3)  
 
 
As funcionalidades desse aplicativo são:
* Adicionar um novo empréstimo;
* Listar empréstimos existentes;
* Filtrar esses empréstimos;
* Gerar um arquivo para impressão com informações sobre um empréstimo.

<img src="https://github.com/jaen3dev/app-gerenciador-de-emprestimos-igds/assets/152646582/b763f4cb-cdfe-466f-be9f-c1c6a48442f5" width="800" height="520">
 
<img src="https://github.com/jaen3dev/app-gerenciador-de-emprestimos-igds/assets/152646582/e4620332-b74f-4cae-a0cd-a6de06ceb62e" width="800" height="450"/>
 
<img src="https://github.com/jaen3dev/app-gerenciador-de-emprestimos-igds/assets/152646582/68b344c4-f99f-46c4-a74e-fe573a69f171" width="800" height="450"/>


<h2 id="tecnologias">Tecnologias</h2>

 As tecnologias usadas nesse aplicativo foram:
* React;
* React Router DOM;
* Tauri;
* SCSS.
  
Inicialmente pensei em usar Electron para o aplicativo, porém o computador onde ficaria o aplicativo era antigo e lento, para poupar na parte de gasto de recursos, pesquisei alternativas e assim encontrei o Tauri que permite usar Javascript para criar um aplicativo desktop.  
O armazenamento de dados é feito através de um arquivo local que o aplicativo consegue criar e escrever em JSON.  
Todo o site foi feito usando React, o Routering foi feito com React-Router-Dom e a estilização com SCSS.  

<h2 id="conclusao">Conclusão</h2>
Esse projeto foi o mais complexo que fiz até então. Nunca tinha usado Tauri e o React Router DOM, no geral aprendi bastante com esse projeto, desde coisas sobre as tecnologias nunca usadas tanto como coisas do próprio javascript, como assíncronia, manipulação de Date e chain de filtragens.
Eventualmente posso alterar mais o aplicativo, estava pensando em realizar uma aba de edição de empréstimo existente mais 2 tipos de filtros, um por itens e um por nome, mas por desejo do presidente do Instituto o aplicativo em sua forma atual já é o suficiente.
