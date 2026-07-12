// @sos-edit: false

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  content: string; // Formato ChordPro: [Chord]letra...
}

export interface SongBlock {
  id: string;
  name: string;
  songs: Song[];
}

export const SONG_BLOCKS: SongBlock[] = [

  {
    id: 'block-a',
    name: 'Bloco A',
    songs: [
      {
        id: 'revida',
        title: 'Re-vida',
        artist: 'Tim e Vanessa',
        key: 'Eb',
        content: `
Capotraste na 3ª casa

[Am]Incomparável [Am9/B]escuridão, 
[C]noite mista de tortura[Am9/B]
[F7M]E de vazios abissais, 
[F7M]sou todo [G]sofregui[Am]dão

[Am]Os "ais" não escutam [Am9/B]os "ais", 
[C]o silêncio me acu[Am9/B]sa
[F7M]Meu pensamento se esvai, 
[F7M]um uni[G]verso sem cor[Am]

[Am]Mas em meio a eter[G]nidades um[D9/F#] rumor
[C]Ascende em prece e a[G]cende claridade
[C]E [C]resplandece, e a[G]calma tempestades

[C]          [G]      Ouô...

[C]Onde [G6/B]o         [Am]gládio que nos pu[Am7/G]ne?
[F]Onde [F7M(9)/E]o                 [Dm7] peso de gra[G]nitos?
[C]Onde a sen[Em]tença que [Am]zune [Am/G],
se o [F]amor é maior[F7M(9)/E] que meu fim[G]?

[F]A ora[G]ção, a vi[Em]da, a espe[Am]rança, 
[F]me aca[G]lenta,[C] Deus!
[F]Sinto um [G]sono e um sei[Em]o me en[Am]volve, 

[F]crian[G]ça se[C]rei...

[C]Onde [G6/B]o         [Am]gládio que nos pu[Am7/G]ne?
[F]Onde [F7M(9)/E]o                 [Dm7] peso de gra[G]nitos?
[C]Onde a sen[Em]tença que [Am]zune [Am/G],
se o [F]amor é maior[F7M(9)/E] que meu fim[G]?

[F]A ora[G]ção, a [Em]vida, a esperan[Am]ça, 
[F]me aca[G]lenta,[C] Deus!

[F]Sinto um [G]sono e um sei[Em]o me en[Am]volve, 
[F]crian[G]ça se[C]rei...

[F]crian[G]ça se[C]rei...
        `
      },
      {
        id: 'vestes-do-amor',
        title: 'Vestes do Amor',
        artist: 'Tim e Vanessa',
        key: 'A',
        content: `
[D] Quem me tocou?
[A] Pois eu senti[Db7] saindo de mim [F#m]uma virtude[D]
[A] Em meio [Db7]à [F#m]multidão
[D] Perdão, Senhor, [A]me entrego a ti
[Db7]Pois te toquei [F#m]buscando [D]saúde
E [A]logo meu [Db7]sangue [F#m]estancou
[Db7]Quem me tocou?[F#m]
[Db7]Quem me curou?[F#m]
[Bm7]A esperança [A]nos [E]liga [A]ao céu
[D]Toque [A]divino nas [Db7]vestes [F#m]do amor
[D]A ternura [A]é o [E/G#]orvalho[F#m]
[D]Ao sedento [A]via[E4]jor[E]
[D]O sol da [A]escuta é [E/G#]o agasalho[F#m]
[D]A [A]quem [E4]precisa [E]de ca[E4]lor  [E]
[E]Vai em [A]paz minha [E/G#]irmã [F#m]
[D]Foi a tua [A]fé que [E4]te salvou... [E]
[D]Foi a tua [D9]fé que [C#]te salvou... [A4]        `
      },
      {
        id: 'zaqueu',
        title: 'Zaqueu',
        artist: 'Tim e Vanessa',
        key: 'B',
        content: `

[B]Quero [E]ver o [F#]esperado Ra[B]bi na mul[E]tidão.  [F#]
[B]Quero [E]ver o [F#]esperado Ra[B]bi na mul[E]tidão.  [F#]

[G#m]Sei que[G#m/G] passa[G#m/F]rá por [Eb5+]aqui
[E]Sou peque[B/Eb]no e não posso ver[C#m], sua es[Eb7]tatura
[G#m]Tento à [G#m/G]frente, [G#m/F#]procuro[Eb5+] encontrar
[E]Um lugar de onde[B/Eb] O veja[C#m], uma ár[Eb7]vore ao céu

[G#m7]Me elev[F#/A#]arei[B] do[E] [F#]chão
Meu espírito [G#m7]deseja [Ebm9] re[E]tirar [E/Eb]a es[C#m]cama-véu
[F#/A#]E contemplar-te a visão  [B]   [E]   [F#]   [B]   [E]   [F#]

[B]Le[E]van[F#]tando Teu[F#] olhar
[B]Tu me [E]vês em [F#]meu lugar
[B]Me con[E]vidas a [F#]cear
Em [B]minha [E]casa vais[F#] entrar

[G#m]Não me[G#m/G]reço, sou [G#m/F#]Za[Eb5+]queu
[E]Mais um [B/Eb]servo no engano[C#m], sou um[Eb7] publicano
[G#m]Se des[G#m/G]tituí[G#m/F#] a quem [Eb5+]for
[E]Pagarei[B/Eb] com jus[C#m]teza qua[Eb7]tro vezes mais
[G#m7]Me eleva[F#/A#]rei[B] do[E] [F#]chão
Meu espí[G#m7]rito deseja[Ebm9] [E]retirar[E/Eb] a es[C#m]cama-véu
[F#/A#]E contemplar-te a visão  [B]   [E]   [F#]   [B]   [E]   [F#]

 G#m  G#m/G  G#m/F#  Eb5+ 
 E  B/Eb  C#m  Eb7  G#m7  F#/A#  B  E  F# 
 G#m7  Ebm9  E  E/Eb  C#m  F#/A#  B  E  F#  B  E  F# 

[B]Hoje [E]entrou em [F#]minha casa
A Verdade, [B]a Sal[E]vação   [F#]
E a Ti[B] eu [E]ofereço   [F#]
O ofí[B]cio de [E]meu pão   [F#]

G#m G#m/G G#m/F# Eb5+
[G#m]Já en[G#m/G]tendo o[G#m/F#] que [Eb5+]queres dizer:
[E] “Vinde a mim os[B/Eb] pequenos[C#m]..."
Os sicômo[Eb7]ros galgar

[G#m7]Me eleva[F#/A#]rei[B] do[E] [F#]chão
Meu espíri[G#m7]to deseja[Ebm9] re[E]tirar[E/Eb] a es[C#m]cama-véu
[F#/A#]E contemplar-te a visão   [B]   [E]   [F#]

[G#m7]Me eleva[F#/A#]rei[B] do[E]   [F#]chão
Meu espíri[G#m7]to deseja[Ebm9] re[E]tirar[E/Eb] a es[C#m]cama-véu
[F#/A#]E contemplar-te a visão   [B]   [E]    [F#]
[B]E contemplar-te a visão         [B]  [B4]   [B]        `
      },
      {
        id: 'cantaro',
        title: 'Cântaro',
        artist: 'Tim e Vanessa',
        key: 'B',
        content: `
Intro:  B   F#sus4/Bb    G#m7/E    F#sus4/E

   (3x)   F#7/9

[B]Como falas[F#sus4/Bb] tu comigo, [G#m7]sendo eu [G#m7/F#]samaritana
[E]Te revelas [E/D#]meu amigo, [E]C#]justo eu [F#7/9]mulher 
insana
    
[B]Oh, Gali[F#sus4/Bb]leu     [G#m7/E]
Junto ao[F#sus4/E] poço busco [B]água[F#sus4/Bb]          [G#m7/E]
E me [F#sus4/E]trazes a água[B] viva[F#sus4/Bb]          [G#m7/E]
Tu me compree[D#m7]ndes[E], no incons[D#m7]ciente[E], tenho 
sede [E/F]n'alma ven[F#7/9]cida
               
[B]Com teus [F#sus4/Bb]olhos me divi[G#m7]sas e me[G#m7/F#] livras da 
armadilha
[E]Onde os homens, [E/D#]os maridos, [E/C#]os altares 
[F#7/9]deste mundo
[B]Oh, Galileu[F#sus4/Bb]     [G#m7/E]
Junto ao[F#sus4/E] poço busco [B]água[F#sus4/Bb]          [G#m7/E]
E me [F#sus4/E]trazes a água[B] viva[F#sus4/Bb]          [G#m7/E]
Tu me com[D#m7]preendes[E], no incons[D#m7]ciente[E], tenho 
sede [E/F]n'alma ven[F#7/9]cida

[G#m]Se soubes[G#m/G]ses quem te[G#m/F#] pede de [G#m7]beber     [G#m7]
Busca[D#m7]ria [C#m7/9]água pura que [B]brota do espí[F#7/9]rito

[B]Estou plena,[F#sus4/Bb] estou viva, [G#m7]Siloé já não[G#m7/F#] sacia
[E]Me buscaste [E/D#]no mais fundo do[E/C#] meu ser eu te 
[F#7/9]encontro
[B]Oh, Galileu[F#sus4/Bb]          [G#m7/E]
[F#sus4/E]Tua presença me conforta
É verda[F#sus4/E]de que li[B]berta[F#sus4/Bb]          [G#m7/E]
Levarei teu [D#m7]cantaro[E]
[E]Eu direi aos [D#m7]ávidos
[E]Já habita em nós [E/F]o Messi[F#7/9]as

B  F#sus4/Bb    G#m7/E    F#sus4/E   (3x)  
Oh Galileu

[B]Junto ao poço eu te encontrei

        `
      },
      {
        id: 'a-casa-lar',
        title: 'A Casa-Lar',
        artist: 'Tim e Vanessa',
        key: 'A',
        content: `
        
[Intro] E  E/D#  E/C#  E/B  A9

E              A9
O ser no corpo é um passarinho
E   E/D#  E/C#  E/B  A9
Na janela quer voar
F#m7(4)/C#      C#m7          G#m7/D#
O pensar evola, vibra harmonias pelo   
  A9        A6(9)
éter, pelo ar

E              A9
Sofre os olhos deita a vista
E      E/D#  E/C#  E/B  A9
Sobre o mar, sobre amar
F#m7(4)/C#            C#m7      G#m7/D#  
Cativeiro, marinheiro, marear, homem ao 
A9  A6(9)
mar

A9
Mas o teu corpo
           E      E/D#     E/C#   E/B  A9
É teu meio de cantar de sentir, de sonhar
                  E   E/D#  E/C#  E/B  A9
Saborear ar e mar amorear, sensorear
                   E           
É tua casa, casulo, testemunhos, 
E/D#
estremunhos
A9                 E     E/D#     A9
A casa-lar, a casa, a casa, a casa
        `
      },
      {
        id: 'mediuns',
        title: 'Médiuns',
        artist: 'Tim e Vanessa',
        key: 'G',
        content: `
Intro] G  B7  C  Cm
        G  A4/G  C  D4  G


E|---2-0------------| 
B|-------1-0--------| 
G|-----------2-0----| 
D|-0--------------0-| 
A|------------------| 
E|------------------| 

G                      B7
Em verdade eu vos digo
             C         Cm
Que se eles se calarem
     G                A4/G
As pedras é que falarão
            C              D4
Vossos velhos terão sonhos
           C         D4    G
Vossos jovens profetizarão
G                      B7
Em verdade eu vos digo
             C         Cm
Que se eles se calarem
     G                A4/G
As pedras é que falarão
            C              D4
Vossos velhos terão sonhos
           C         D4    G
Vossos jovens profetizarão
Em               Bm
Cajado de Moisés
C                G
O manto de Elias
Em             Bm
Escada de Jacó
C                D7
As visões de Jeremias
G                    D
Hoje médiuns, antes, profetas
C               D7
Faculdades não mais ocultas
G                     D
Quantos falam, quantos sentem
C                        D7    G  D7
Quantos ouvem, quantas línguas
         G             B7
Em verdade eu vos digo
             C         Cm
Que se eles se calarem
     G                  A4/G
As pedras é que falarão
            C              D4
Vossos velhos terão sonhos
           C         D4    G
Vossos jovens profetizarão
G                      B7
Em verdade eu vos digo
             C         Cm
Que se eles se calarem
     G                A4/G
As pedras é que falarão
            C                D4
Vossos velhos terão sonhos
           C         D4    G
Vossos jovens profetizarão
Em                  Bm
Nas Bodas de Caná
C                    G
Na cura das feridas
Em                Bm
Na Transfiguração
C       C#m5-         D7
Nos dando a água viva
G                         D
Sempre Mestre, sempre Profeta
C                D7
Ser divino, Ser o Guia
G                       D
Quantos calam, quantos sentem
C                        D7    G  D7
Quantos ouvem o médium da Vida
G                      B7
Em verdade eu vos digo
             C         Cm
Que se eles se calarem
     G                A4/G
As pedras é que falarão
            C              D4
Vossos velhos terão sonhos
           C         D4    G
Vossos jovens profetizarão

( G  A  C  D4 )        `
      }
    ]
  },
  {
    id: 'block-b',
    name: 'Bloco B',
    songs: [
      {
        id: 'para-sempre',
        title: 'Para sempre em meu coração',
        artist: 'Tim e Vanessa',
        key: 'E',
        content: `
[Primeira Parte]

E                            E7M
Nem se eu pudesse ter o pôr do sol
   A                              Am6
A lua ou as estrelas, toda natureza
E                           E7M
Nem se eu tivesse todo ouro
   A                               Am6
E não tivesse um amigo... Nada teria
A                      B7            
  Pois quando eu começasse a me sentir 
    G#m   C#m
sozinho
A               B7        E  E7
Quem é que me consolaria?
A               B7                  G#m  
Mas Deus é bom botou você em meu caminho
C#m

                      F#m    B7
Pra que não me falte alegria

[Refrão]
            E        E7M                 
Você vai estar para sempre dentro do meu 
     A
coração
         Am6    E
Vou lembrar de nós
              E7M                     A  
Sempre que alguém contar esta canção!
Am6


[Segunda Parte]

E                                  E7M
Nem se eu soubesse muitas palavras
A                                    Am6
Nem se eu as transformasse em poesia
E                              E7M
Não diria tudo o que há pra dizer
A                          Am6
A inspiração de certo faltaria
E               B7           G#m   C#m
Mas se algum dia me faltar o seu abraço?
A           B7            E  E7
Não será triste a saudade
A             B             G#m        C#m
Pois sei que nos encontraremos no espaço
       F#m           B7
Meu amigo de verdade        `
      },
      {
        id: 'apenas-amar',
        title: 'Apenas Amar',
        artist: 'Denis Soares',
        key: 'C',
        content: `
  C                F7M              
Todo o Céu se organiza para vir nos 
 C            C7M
transformar
   C                F7M           G/C  
O Cristo já nos auxilia para vida nova 
    G
alçar
C                   F7M               
Ondas de atos belos podem vir de nossas 
    C          C7M
próprias mãos
C                F7M               G/C   
Sentimentos triunfantes brotam naturais, 
   G
então

F7M           Em          F7M          Em
Vou por dentro me preparar pra sem rebeldia
 aceitar
F7M         Em           F7M         G
Invencível expande o amor em fraternidade

F       F7M    C
E eu desejo apenas amar, e todo um mar
F    F7M        C
De afetos cativar
F    F7M                 C
Uma luz vem pra resplandecer, dentro do ser
F         F7M          C
Para ao Pai glorificar        `
      },
      {
        id: 'amigo-presente',
        title: 'Amigo presente',
        artist: 'Tim e Vanessa',
        key: 'D',
        content: `
[D]Quando a noite ch[Bm]egar e o frio apertar
[G]Eu sei que ao meu l[A7]ado tu vais caminhar
[D]Amigo presente, d[Bm]e luz e bondade
[G]Teu abraço aquece [A7]a nossa amizade

[G]Jesus, companheiro [A]de toda jornada
[D]Tua presença [Bm]ilumina a estrada
[G]Nunca estou só, [A]posso sentir
[G]Tua força a me [A7]conduzir
        `
      },
      {
        id: 'bilha',
        title: 'Bilha',
        artist: 'Tim e Vanessa',
        key: 'E',
        content: `

[Bb] Uo Uo Uo Uo  [Eb]Uoooooo[F]


[Bb] O evangelho nas areias
[Eb] Áquila e Prisca, a família[Bb] uou[Eb]ouoooo
[Bb] Na pureza de bondade
[Eb] Abrem suas portas ao errante[Bb] uou[Eb]ouoooo

[Refrão]

[D#] És bem vindo à nossa casa
[Bb] Toma a água, eis a bilha
[Eb] Dessendenta ne[F]la tua [Bb]vida
[Eb] Vem beber do [F]vaso que [Bb]sacia
   
[Gm]Ouço as histó[Dm]rias, tua [D#] casa, o teu pai
[Gm]Teu passado [Dm]e minha ag[D#]onia
[Gm]Já enxergo [Dm]agora, no t[D#]rabalho, [Eb]no tear
[D#]Vou tecendo[Dm] meu falar e
[D#]A nossa amizade é um [F]culto

[Refrão]

[D#]És bem vindo à nossa casa
[Bb]Toma a água, eis a bilha
[Eb]Dessendenta ne[F]la tua [Bb]vida
[Eb]Vem beber do v[F]aso que [Bb]sacia

[Gm]Sou cristão [Dm]confesso
[D#]Digo mais, eu fui tão cego
[Gm]Que tantos [Dm]remorsos ca[D#]rrego
[Gm]No afã de t[Dm]er sucesso
[D#]Inaugurei perseguições
[Eb]São incontá[Dm]veis as ações
[D#]Foi quando eu mergulhei o olhar em [F]Estevão
Uo Uo Uo [D#]Uooo [F]Uooo [Bb]Uooo
[D#]Uooo[F]ôooo[BB]ôooo
[D#]Uooo[F]ôooo[BB]ôooo

[Gm]Devo ir em[Dm]bora, tu[D#]a casa é um altar
[Gm]Sou estorvo à [Dm] tua harmo[D#]   [Eb]   [F]nia

[D#]És presente em nossa ten[F]da
[D#]Qualquer um que se arrepen[F]da
[Eb]E conosco s[f]irva O Bom Am[Bb]igo
[Eb]Sois ovelha [F]que volta ao [Bb]aprisco
[D#]Uooo[F]ôooo[BB]ôooo
[D#]Uooo[F]ôooo[BB]ôooo

[Refrão]

[D#]És bem vindo à nossa casa
[Bb]Toma a água, eis a bilha
[Eb]Dessendenta ne[F]la tua [Bb]vida
[Eb]Vem beber do v[F]aso que sa[Bb]cia
Uoooôoooô[Eb]ooo [F]
[Bb]Uoooôooo
… [Eb]Pois serás o [F]vaso que [Bb]sacia
        `
      },
      {
        id: 'uma-prece',
        title: 'Uma prece',
        artist: 'Tim e Vanessa',
        key: 'F',
        content: `
[F]Eleva o pensamento [Dm]ao alto em oração
[Bb]Abre as comportas [C7]do teu coração
[F]Uma prece simples, [Dm]um sussurro de fé
[Bb]Que nos sustenta [C7]e nos põe de pé

[Gm]O Pai nos ouve, [C7]mesmo no silêncio
[F]Tudo é resposta, [Dm]tudo é amor
[Bb]Confia e espera, [Gm]o bálsamo da paz
[Bb]A sua presença s[C7]empre nos traz
        `
      },
      {
        id: 'de-bem',
        title: 'De bem com a vida',
        artist: 'Tim e Vanessa',
        key: 'A',
        content: `
[A]Acordar sorrindo, [F#m]ver o sol brilhar
[D]Agradecer a Deus [E7]por poder cantar
[A]De bem com a vida, [F#m]de bem com o irmão
[D]Cultivando flores [E7]no meu coração

[Bm]Não há tristeza [E7]que resista al amor
[A]Não há tempestade [F#m]que vença o calor
[D]Da fé que me guia, [Bm]da paz que me conduz
[D]Caminho contente [E7]na senda da luz
        `
      }
    ]
  },
  {
    id: 'block-c',
    name: 'Bloco C',
    songs: [
      {
        id: 'apostolo',
        title: 'Apóstolo da Samaria',
        artist: 'Tim e Vanessa',
        key: 'C',
        content: `
[C]Apóstolo do amor, [Am]levando a mensagem [F]de paz e luz [G]por toda a Samaria.
[C]Com bondade e [Am]fé constante, [F]anunciando a [G]Boa Nova cada dia.
        `
      },
      {
        id: 'veredas',
        title: 'Veredas',
        artist: 'Tim e Vanessa',
        key: 'D',
        content: `
[D]Pelas veredas da [Bm]vida vou caminhar [G]com fé no coração [A]e passos firmes.
[D]Nas curvas do ca[Bm]minho sei que a luz do [G]Evangelho [A]vai me guiar.
        `
      },
      {
        id: 'parnaso',
        title: 'Parnaso de além túmulo',
        artist: 'Tim e Vanessa',
        key: 'Em',
        content: `
[Em]Vozes poetas que [Am]cantam a imortalidade, [C]revelando a beleza [B7]do além-túmulo.
[Em]Rimas de luz e [Am]consolo, [C]mostrando que a vida continua [B7]no infinito.
        `
      },
      {
        id: 'juventude',
        title: 'Juventude e Vida',
        artist: 'Tim e Vanessa',
        key: 'G',
        content: `
[G]Juventude dourada, [Em]tempo de plantar o bem [C]e colher a vida [D7]eterna.
[G]Com alegria e vi[Em]gor, seguindo o [C]plano do Cri[D7]ador.
        `
      },
      {
        id: 'patria',
        title: 'Pátria do Evangelho',
        artist: 'Tim e Vanessa',
        key: 'C',
        content: `
[C]Brasil, pátria querida, [Am]coração do mundo, [F]lar do Evangelho [G]de Jesus.
[C]Sob o manto azul do [Am]céu, semeando a [F]semente da [G]paz.
        `
      },
      {
        id: 'jesus-mestre',
        title: 'Jesus, o Mestre',
        artist: 'Tim e Vanessa',
        key: 'D',
        content: `
[D]Jesus, doce Mestre, [Bm]guia meu viver [G]com o teu amor [A]infinito.
[D]Tua palavra de [Bm]vida é o porto que [G]acalma meu [A]coração.
        `
      }
    ]
  },
  {
    id: 'block-d',
    name: 'Bloco D',
    songs: [
      {
        id: 'caminhando-juntos',
        title: 'Caminhando Juntos',
        artist: 'Tim e Vanessa',
        key: 'G',
        content: `[G]Caminhando juntos [Em]na mesma direção, [C]lado a lado, [D7]como irmãos de fé.`
      },
      {
        id: 'alivio',
        title: 'Alívio',
        artist: 'Tim e Vanessa',
        key: 'C',
        content: `[C]Encontro alívio [Am]nas tuas palavras de paz, [F]bálsamo doce [G]que acalma a alma.`
      },
      {
        id: 'aprendiz',
        title: 'Aprendiz',
        artist: 'Tim e Vanessa',
        key: 'D',
        content: `[D]Sou apenas um [Bm]aprendiz do Teu amor, [G]buscando a cada dia [A]ser melhor.`
      },
      {
        id: 'madalena',
        title: 'História de Madalena',
        artist: 'Tim e Vanessa',
        key: 'Am',
        content: `[Am]Madalena chorou aos [Dm]pés da cruz, [G]mas sorriu ao ver [C]a luz do Ressurgido.`
      },
      {
        id: 'eden',
        title: 'Eden',
        artist: 'Tim e Vanessa',
        key: 'E',
        content: `[E]Jardim do Eden, [C#m]relembrando a pureza [A]da alma antes [B7]de despertar.`
      },
      {
        id: 'assim-seja',
        title: 'Assim seja',
        artist: 'Tim e Vanessa',
        key: 'A',
        content: `[A]Que a tua vontade, [F#m]Senhor, se faça em mim. [D]Assim seja [E7]para sempre.`
      }
    ]
  },
  {
    id: 'block-e',
    name: 'Bloco E',
    songs: [
      {
        id: 'chicos',
        title: 'Chicos',
        artist: 'Tim e Vanessa',
        key: 'D',
        content: `[D]Chico Xavier, [Bm]exemplo de humildade [G]e amor puro aos [A]nossos corações.`
      },
      {
        id: 'aos-pes',
        title: 'Aos pés do Monte',
        artist: 'Tim e Vanessa',
        key: 'Em',
        content: `[Em]Aos pés do monte [Am]ouvi o sermão da montanha, [C]luz que clareia [B7]o caminho.`
      },
      {
        id: 'sempre-jovens',
        title: 'Sempre jovens',
        artist: 'Tim e Vanessa',
        key: 'G',
        content: `[G]Sempre jovens no [Em]espírito, cantando a [C]alegria de viver [D7]com Jesus.`
      },
      {
        id: 'suplica',
        title: 'Súplica de um galho',
        artist: 'Tim e Vanessa',
        key: 'Am',
        content: `[Am]Sou como um galho [Dm]da videira do Senhor, [F]pedindo seiva [E7]para dar frutos.`
      },
      {
        id: 'luzes',
        title: 'Luzes da Luz',
        artist: 'Tim e Vanessa',
        key: 'C',
        content: `[C]Luzes que emanam [Am]da Grande Luz do Universo, [F]iluminando [G]nossa jornada.`
      },
      {
        id: 'aurora',
        title: 'Aurora',
        artist: 'Tim e Vanessa',
        key: 'D',
        content: `[D]A aurora desponta [Bm]trazendo a esperança [G]de um novo dia [A]de trabalho e paz.`
      }
    ]
  },
  {
    id: 'block-f',
    name: 'Bloco F',
    songs: [
      {
        id: 'concepcao',
        title: 'Concepção Astral',
        artist: 'Tim e Vanessa',
        key: 'C',
        content: `[C]Nos planos mais [Am]altos da concepção astral, [F]desenha-se a nossa [G]jornada na Terra.`
      },
      {
        id: 'tres-horas',
        title: 'Três horas',
        artist: 'Tim e Vanessa',
        key: 'Fm',
        content: `[Fm]Às três horas da [Bbm]tarde, uma prece de amor [Db]envolve toda a [C7]Terra.`
      },
      {
        id: 'perdao',
        title: 'Perdão',
        artist: 'Tim e Vanessa',
        key: 'G',
        content: `[G]Perdoar setenta [Em]vezes sete, [C]limpando o coração [D7]de toda mágoa.`
      },
      {
        id: 'reconciliacao',
        title: 'Reconciliação e paz',
        artist: 'Tim e Vanessa',
        key: 'D',
        content: `[D]Abraçar o adversário [Bm]no caminho, selando [G]a reconciliação [A]e a paz.`
      },
      {
        id: 'jesus-mestre-f',
        title: 'Jesus, o Mestre (Bloco F)',
        artist: 'Tim e Vanessa',
        key: 'C',
        content: `[C]Mestre Jesus, [Am]guia e modelo [F]para toda a humanidade [G]sofredora.`
      },
      {
        id: 'porto-amor',
        title: 'Porto Amor',
        artist: 'Tim e Vanessa',
        key: 'G',
        content: `[G]Navegando no mar da [Em]vida, encontrei meu porto [C]seguro no amor [D7]do Cristo.`
      }
    ]
  },
  {
    id: 'block-g',
    name: 'Bloco G',
    songs: [
      {
        id: 'familia',
        title: 'Família Universal',
        artist: 'Tim e Vanessa',
        key: 'C',
        content: `[C]Todos filhos do [Am]mesmo Pai, formando a [F]grande família [G]universal.`
      },
      {
        id: 'fala-com-deus',
        title: 'Fala com Deus',
        artist: 'Tim e Vanessa',
        key: 'D',
        content: `[D]Fala com Deus no [Bm]silêncio da alma, [G]Ele te ouve [A]e acalma.`
      },
      {
        id: 'duplo-eterno',
        title: 'Duplo eterno',
        artist: 'Tim e Vanessa',
        key: 'Em',
        content: `[Em]Ligados pelo fio [Am]invisível do afeto, [C]dois corações [B7]em sintonia eterna.`
      },
      {
        id: 'se',
        title: 'Sê',
        artist: 'Tim e Vanessa',
        key: 'G',
        content: `[G]Sê paciente, [Em]sê amoroso, [C]sê a light no [D7]caminho do teu irmão.`
      },
      {
        id: 'caim-abel',
        title: 'Caim e Abel',
        artist: 'Tim e Vanessa',
        key: 'Am',
        content: `[Am]Superando antigas [Dm]rivalidades, restaurando [F]o amor de irmãos [E7]do princípio.`
      },
      {
        id: 'ramas',
        title: 'Ramas',
        artist: 'Tim e Vanessa',
        key: 'D#',
        content: `[D]Somos ramas da [Bm]videira divina, [G]nutridas pelo amor [A]do Pai.`
      }
    ]
  }
];


