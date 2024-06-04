# Exercício: Quake log Parser
## História 1

Eu como administrador do jogo, quero ter a estatística por jogo, do total de mortes, de mortes por causa e de mortes causadas pelo `<world>` para entender dificuldade dos jogadores.

## História 2

Eu como player, quero ver o ranking de cada partida para saber o vencedor e meu desempenho.

**Critérios de aceite:**

- Os jogadores começam com zero pontos
- A cada kill o jogador ganha um ponto
- A cada morte pelo mundo o jogador perde um ponto
- É permitido pontuação negativa
- O `<world>` não deve entrar no ranking de jogadores
- Os jogadores podem mudar de nome no meio da partida, mas só o último nome deve ser considerado no ranking

## História 3

Eu como administrador do jogo, quero poder consultar as estatísticas de um jogo específicou ou de todos os jogos de maneira estruturada por uma API para montar uma visualização para os jogadores

# Collection Postman
**Caminho:** 'postman/GameStats.postman_collection.json'
