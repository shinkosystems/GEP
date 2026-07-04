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

const ORIGINAL_SONG_BLOCKS: SongBlock[] = [
  {
    id: 'block-a',
    name: 'Bloco A',
    songs: [
      {
        id: 'revida',
        title: 'Re-vida',
        artist: 'Tim e Vanessa',
        key: 'Cm',
        content: `
[Cm]Toda semente adorm[Ab]ecida clama
[Bb]Por o ver-ter de um [Eb]raio de sol
[Cm]Toda ferida de [Ab]amor inflamada
[Bb]Chora a escuridão [G7]do arrebol

[Fm]Mas a semente que [G]brota na terra
[Cm]Cresce em direção [Ab]à luz da flor
[Fm]E a alma que a [G]dor desespera
[Ab]Busca o alívio nas [G7]vestes do Senhor

[Cm]Re-vida, brisa de e[Ab]sperança
[Bb]Re-vida, canto do c[Eb]oração
[Cm]A alma canta e [Ab]se harmoniza
[Bb]Na luz divina [G7]da reencarnação
        `
      },
      {
        id: 'vestes-do-amor',
        title: 'Vestes do Amor',
        artist: 'Tim e Vanessa',
        key: 'G',
        content: `
[G]Ela correu por entre [Em]a multidão
[C]Tinha a alma cheia [D7]de aflição
[G]Se eu apenas t[Em]ocar nas suas vestes
[C]Ficarei curada d[D7]este mal terrestre

[Am]E o Mestre sentiu [D7]que dele saiu
[G]Uma força que cura [Em]a quem nele creu
[C]Quem me tocou? Per[Am]guntou a olhar
[C]Fui eu, Senhor, [D7]vinde me abençoar
        `
      },
      {
        id: 'zaqueu',
        title: 'Zaqueu',
        artist: 'Tim e Vanessa',
        key: 'C',
        content: `
[C]Zaqueu subiu na f[Am]igueira para ver
[F]O bom Jesus que e[G]stava a passar
[C]Ele era baixo e [Am]queria conhecer
[F]Aquele amigo que [G]veio para amar

[F]Zaqueu, desce de p[G]ressa da árvore
[C]Hoje na tua casa [Am]vou me hospedar
[F]E o coração de Z[G]aqueu se abriu
[F]Toda a riqueza do [G7]bem repartiu
        `
      },
      {
        id: 'cantaro',
        title: 'Cântaro',
        artist: 'Tim e Vanessa',
        key: 'B',
        content: `
[B]Como falas tu co[F#/Bb]migo sendo eu sa[G#m7]maritana? [B/F#]
[E]Te revelas meu a[E/D#]migo
[C#m]Justo eu, mulher in[F#4]sana [F#]

[B]Se soubesses quem te [F#/Bb]pede água viva da co[G#m7]mpreensão [B/F#]
[E]Tu me pedirias [E/D#]fonte
[C#m]Que brotasse do [F#4]coração [F#]

[G#m]Dá-me desta água, S[D#m]enhor, quero beber
[E]Para a sede eterna [F#4]nunca mais ter [F#]
[G#m]E o cântaro no [D#m]poço ela deixou
[E]Pois a água da vida [F#4]ela provou [F#]
        `
      },
      {
        id: 'a-casa-lar',
        title: 'A Casa-Lar',
        artist: 'Tim e Vanessa',
        key: 'D',
        content: `
[D]Minha casa é [A/C#]um templo de paz
[Bm]Onde a luz do ev[G]angelho reluz
[Em]Toda a família se [A7]reúne feliz
[Em]Seguindo as peg[A7]adas de Jesus

[D]A casa-lar é a [A/C#]escola do amor
[Bm]Onde aprendemos [G]a nos perdoar
[Em]Sob a bênção [A7]do Criador
[G]Vamos juntos e[A7]sse templo cons[D]truir
        `
      },
      {
        id: 'mediuns',
        title: 'Médiuns',
        artist: 'Tim e Vanessa',
        key: 'Am',
        content: `
[Am]Médiuns da vida, p[Dm]ontes da luz
[G]Estendendo as mãos [C]ao Mestre Jesus
[Am]Ouvindo as vozes do [Dm]além-túmulo a cantar
[F]Consolo e paz [E7]para quem chorar

[Am]Moisés no monte, E[Dm]lias a ouvir
[G]O sussurro do vento [C]a discernir
[F]E nos tempos de [Dm]hoje a mensagem continua
[F]A provar que a vida [E7]jamais recua
        `
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
        key: 'G',
        content: `
[G]Para sempre em meu c[Em]oração guarda[C]rei a tua pa[D7]lavra
[G]Como luz que guia [Em]meus passos no m[C]eio da estrada [D7]
[Em]Na alegria ou no [Bm]sofrimento serei [C]teu servo f[G]iel
[Am]Cantando a glória [D7]do Reino do Céu
        `
      },
      {
        id: 'apenas-amar',
        title: 'Apenas Amar',
        artist: 'Tim e Vanessa',
        key: 'C',
        content: `
[C]Não quero ouro, [Am]não quero o poder
[F]Só quero aprender [G]a me dar e a ser
[C]Estender a mão [Am]a quem cair
[F]E um novo sorriso [G]ajudar a abrir

[F]Apenas amar, [G]apenas servir
[C]Com o Mestre da luz [Am]apenas seguir
[F]Na caridade pura [G]meu porto achar
[F]Apenas amar, [G7]apenas amar
        `
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
[Eb] Áquila e Prisca, a família[Bb][Eb] uououoooo
[Bb] Na pureza de bondade
[Eb] Abrem suas portas ao errante[Bb]   [Eb] uououoooo

[Refrão]

[D#] És bem vindo à nossa casa
[Bb] Toma a água, eis a bilha
[Eb] Dessendenta ne[F]la tua [Bb]vida
[Eb] Vem beber do [F]vaso que [Bb]sacia
   
[Gm]Ouço as histó[Dm]rias, tua [D#] casa, o teu pai
[Gm]Teu passado [Dm]e minha ag[D#]onia
[Gm]         [Dm]         [D#]       [Eb]
[Já enxergo agora, no trabalho, no tear
[D#]       [Dm]
Vou tecendo meu falar e
[D#]                   [F]
A nossa amizade é um   culto

[Refrão]

[D#]
És bem vindo à nossa casa
[Bb]
Toma a água, eis a bilha
Eb           F       Bb
Dessendenta nela tua vida
Eb            F       Bb
Vem beber do vaso que sacia

Gm         Dm
Sou cristão confesso
D#
Digo mais, eu fui tão cego
Gm         Dm         D#
Que tantos remorsos carrego
Gm         Dm
No afã de ter sucesso
D#
Inaugurei perseguições
Eb         Dm
São incontáveis as ações
D#                                 F
Foi quando eu mergulhei o olhar em Estevão
         D#   F    Bb
Uo Uo Uo Uooo Uooo Uooo
D#  F   Bb
Uoooôoooôooo
D#  F   Bb
Uoooôoooôooo

Gm        Dm     D#
Devo ir embora, tua casa é um altar
Gm           Dm        D#  Eb  F
Sou estorvo à tua harmonia

D#                      F
És presente em nossa tenda
D#                        F
Qualquer um que se arrependa
Eb         F            Bb
E conosco sirva O Bom Amigo
Eb           F           Bb
Sois ovelha que volta ao aprisco
Bb       Eb   F
Uoooôoooôooo
Bb       Eb   F
Uoooôoooôooo

[Refrão]

D#
És bem vindo à nossa casa
Bb
Toma a água, eis a bilha
Eb          F        Bb
Dessendenta nela tua vida
Eb            F        Bb
Vem beber do vaso que sacia
        Eb   F
Uoooôoooôooo
Bb
Uoooôooo
  Eb           F        Bb
… Pois serás o vaso que sacia
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
        key: 'D',
        content: `[D]Somos ramas da [Bm]videira divina, [G]nutridas pelo amor [A]do Pai.`
      }
    ]
  }
];

// Carrega as músicas combinando o catálogo inicial com as edições no localStorage
export function loadAllSongBlocks(): SongBlock[] {
  const storedEdits = localStorage.getItem('gep-cifras-edits');
  if (!storedEdits) {
    return ORIGINAL_SONG_BLOCKS;
  }

  try {
    const edits: { [songId: string]: Partial<Song> } = JSON.parse(storedEdits);
    return ORIGINAL_SONG_BLOCKS.map(block => ({
      ...block,
      songs: block.songs.map(song => {
        if (edits[song.id]) {
          return {
            ...song,
            ...edits[song.id]
          };
        }
        return song;
      })
    }));
  } catch (e) {
    console.error('Erro ao ler edições do localStorage', e);
    return ORIGINAL_SONG_BLOCKS;
  }
}

// Salva as alterações de uma música no localStorage
export function saveSongEdit(songId: string, updatedFields: Partial<Song>): void {
  const storedEdits = localStorage.getItem('gep-cifras-edits');
  let edits: { [songId: string]: Partial<Song> } = {};

  if (storedEdits) {
    try {
      edits = JSON.parse(storedEdits);
    } catch (e) {
      console.error('Erro ao ler edições antigas', e);
    }
  }

  edits[songId] = {
    ...(edits[songId] || {}),
    ...updatedFields
  };

  localStorage.setItem('gep-cifras-edits', JSON.stringify(edits));
}

// Restaura os padrões
export function resetAllSongEdits(): void {
  localStorage.removeItem('gep-cifras-edits');
}
