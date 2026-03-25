export interface Guide {
  slug: string;
  icon: string;
  bg: string;
  title: string;
  desc: string;
  sections: { heading: string; content: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: "setup",
    icon: "S",
    bg: "bg-grow-primary/10",
    title: "Set & Setting",
    desc: "Espaco, luz, ventilacao, temperatura e VPD",
    sections: [
      {
        heading: "Espaco de cultivo",
        content: `O primeiro passo e definir o espaco. Indoor, voce precisa de um grow tent ou um espaco fechado com controle de luz. Tamanhos comuns:

- 60x60cm: 1-2 plantas
- 80x80cm: 2-4 plantas
- 120x120cm: 4-9 plantas

O espaco precisa ser 100% vedado contra luz externa (light leak). Na floracao, qualquer vazamento de luz pode causar hermafroditismo.`,
      },
      {
        heading: "Iluminacao",
        content: `A luz e o motor do crescimento. Tipos principais:

LED Quantum Board: Melhor custo-beneficio. 100-150W para 60x60, 200-300W para 120x120. Procure LEDs com Samsung LM301B ou LM301H.

HPS (Sodio): Classico, gera muito calor. 250W-400W. Bom para flora mas exige boa ventilacao.

PPFD recomendado por fase:
- Muda: 200-400 umol
- Vegetativo: 400-600 umol
- Floracao: 600-900 umol`,
      },
      {
        heading: "Ventilacao",
        content: `Renovacao de ar e essencial. Voce precisa de:

1. Exaustor: Remove ar quente e umido. Calcule o volume do tent (LxAxP em metros cubicos) e multiplique por 60 para o CFM minimo.

2. Filtro de carvao: Elimina odor. Conecte ao exaustor.

3. Ventilador oscilante: Fortalece os caules e evita mofo. Nao aponte direto nas plantas.

4. Entrada de ar passiva: Abertura na parte inferior do tent.`,
      },
      {
        heading: "Temperatura e umidade (VPD)",
        content: `Ranges ideais por fase:

Germinacao: 24-28C / 70-80% UR
Muda: 22-26C / 65-75% UR
Vegetativo: 22-28C / 50-65% UR
Floracao: 20-26C / 40-55% UR
Secagem: 18-22C / 55-62% UR

VPD (Deficit de Pressao de Vapor) e a metrica mais precisa. Mantenha entre 0.8-1.2 kPa no veg e 1.2-1.6 kPa na flora.`,
      },
    ],
  },
  {
    slug: "phases",
    icon: "F",
    bg: "bg-grow-secondary/10",
    title: "Fases do Cultivo",
    desc: "Germinacao, muda, veg, floracao, colheita",
    sections: [
      {
        heading: "Germinacao (2-7 dias)",
        content: `Metodos mais comuns:

1. Papel toalha: Umedeca duas folhas, coloque a semente entre elas, guarde em local escuro e quente (25-28C). Verifique diariamente.

2. Copo d'agua: Deixe a semente 12-24h em agua filtrada. Quando afundar, transfira para papel toalha ou substrato.

3. Direto no substrato: Faca um furo de 1cm, coloque a semente com a ponta para baixo, cubra levemente. Mantenha umido.

A raiz (radicula) deve aparecer em 24-72h. Quando tiver 1-2cm, transplante para o substrato com cuidado.`,
      },
      {
        heading: "Muda / Seedling (1-2 semanas)",
        content: `A planta tem as primeiras folhas (cotiledones) e as primeiras folhas verdadeiras.

- Luz: 18/6 (18h ligada, 6h desligada), intensidade baixa
- Rega: Pouca agua, solo levemente umido. Use borrifador.
- Nutrientes: Nenhum ou muito diluido (1/4 dose)
- Umidade: 65-75%

Nao transplante ate ter 3-4 nos de folhas verdadeiras.`,
      },
      {
        heading: "Vegetativo (3-8 semanas)",
        content: `Fase de crescimento estrutural. A planta foca em raizes, caules e folhas.

- Luz: 18/6 ou 20/4
- Rega: Ciclos de molhado-seco. Regue quando o substrato estiver seco ate 2-3cm de profundidade.
- Nutrientes: Foco em Nitrogenio (N). NPK tipo 3-1-2 ou 4-2-3.
- Treino: Melhor fase para LST, topping, FIM

Autoflowering: Veg dura 3-4 semanas automaticamente.
Fotoperiodica: Voce controla a duracao. Mude para 12/12 quando quiser iniciar a flora.`,
      },
      {
        heading: "Floracao (6-12 semanas)",
        content: `A planta produz flores (buds). Fase mais critica.

- Luz: 12/12 para fotoperiodicas. Autos continuam 18/6 ou 20/4.
- Nutrientes: Foco em Fosforo (P) e Potassio (K). NPK tipo 1-3-2 ou 0-3-3.
- Umidade: Reduzir para 40-50% para evitar mofo nos buds.
- Semanas 1-3: Stretch (planta pode dobrar de tamanho)
- Semanas 4-6: Buds engordando
- Semanas 7+: Maturacao, tricomas mudando de cor

Faca flush (so agua) nas ultimas 1-2 semanas.`,
      },
      {
        heading: "Colheita e pos-colheita",
        content: `Sinais de que esta pronto:

- Pistilos: 70-80% marrons/alaranjados
- Tricomas (lupa 60x): Maioria leitosos, 10-20% ambar
- Mais ambar = efeito mais relaxante/corporal
- Mais leitoso = efeito mais cerebral/ativo

Corte os ramos, remova folhas grandes (trim). Seque pendurado por 7-14 dias (18-22C, 55-62% UR). Depois, cure em potes de vidro por no minimo 2 semanas, abrindo diariamente.`,
      },
    ],
  },
  {
    slug: "nutrients",
    icon: "N",
    bg: "bg-grow-warning/10",
    title: "Nutricao & pH",
    desc: "NPK, micronutrientes, deficiencias, EC",
    sections: [
      {
        heading: "Macronutrientes (NPK)",
        content: `Os tres nutrientes principais:

Nitrogenio (N): Motor do crescimento vegetativo. Folhas grandes e verdes. Deficiencia: folhas inferiores amarelando.

Fosforo (P): Raizes e flores. Essencial na floracao. Deficiencia: folhas escuras/roxas, crescimento lento.

Potassio (K): Saude geral, resistencia a doencas, transporte de nutrientes. Deficiencia: pontas e bordas das folhas queimando.

Vegetativo: mais N (ex: 3-1-2)
Floracao: mais P e K (ex: 1-3-2)`,
      },
      {
        heading: "Micronutrientes",
        content: `Necessarios em pequenas quantidades mas essenciais:

- Calcio (Ca): Estrutura celular. Deficiencia causa manchas marrons.
- Magnesio (Mg): Centro da clorofila. Deficiencia causa amarelamento entre veias.
- Ferro (Fe): Essencial para fotossintese. Deficiencia causa folhas novas amarelas com veias verdes.
- Enxofre (S), Zinco (Zn), Manganes (Mn), Boro (B), Cobre (Cu), Molibdenio (Mo)

Cal-Mag e o suplemento mais comum, especialmente em coco e hidro.`,
      },
      {
        heading: "pH e EC",
        content: `pH controla a disponibilidade de nutrientes:

Solo: 6.0 - 7.0 (ideal 6.5)
Coco/Hidro: 5.5 - 6.5 (ideal 5.8-6.0)

Meca o pH da agua DEPOIS de adicionar nutrientes. Use pH Down (acido fosforico) ou pH Up (hidroquido de potassio) para ajustar.

EC (Condutividade Eletrica) mede a concentracao de nutrientes:
- Muda: 0.4-0.8 EC
- Veg: 0.8-1.4 EC
- Flora: 1.2-2.0 EC
- Flush: 0.0-0.2 EC

TDS (ppm) = EC x 500 (escala 500) ou EC x 700 (escala 700)`,
      },
      {
        heading: "Diagnosticando deficiencias",
        content: `Regras gerais:

- Folhas INFERIORES afetadas primeiro = nutriente movel (N, P, K, Mg)
- Folhas SUPERIORES afetadas primeiro = nutriente imovel (Ca, Fe, Mn, Zn)
- Amarelamento uniforme = Nitrogenio
- Amarelamento entre veias = Magnesio ou Ferro
- Pontas queimadas = Excesso de nutrientes (nutrient burn)
- Bordas queimando = Potassio
- Manchas marrons = Calcio
- Folhas curvando para baixo (claw) = Excesso de Nitrogenio

IMPORTANTE: 90% dos problemas de deficiencia sao causados por pH errado, nao falta de nutrientes.`,
      },
    ],
  },
  {
    slug: "diseases",
    icon: "D",
    bg: "bg-grow-danger/10",
    title: "Doencas & Pragas",
    desc: "Fungos, acaros, mosca-branca, oidio",
    sections: [
      {
        heading: "Oidio (Powdery Mildew)",
        content: `Po branco nas folhas. Fungo mais comum indoor.

Causa: Umidade alta + pouca ventilacao + temperatura oscilante.

Tratamento:
- Remova folhas muito afetadas
- Pulverize oleo de neem (fase veg apenas)
- Bicarbonato de sodio: 1 colher de sopa por litro d'agua
- Leite: mistura 40% leite / 60% agua (pulverizar sob luz)
- Melhore a ventilacao!

Prevencao: Mantenha umidade abaixo de 55% na flora, boa circulacao de ar, desfolhe folhas internas.`,
      },
      {
        heading: "Acaros (Spider Mites)",
        content: `Pontos brancos/amarelos nas folhas, teias finas embaixo das folhas.

Causa: Ar seco e quente (acima de 27C), falta de circulacao.

Tratamento:
- Pulverize agua com sabao de potassio
- Oleo de neem (veg apenas)
- Acaricida biologico (Neoseiulus californicus)
- Lave as folhas com agua pressurizada

Tratamento agressivo necessario - acaros se reproduzem rapido. Trate a cada 3 dias por 2 semanas.`,
      },
      {
        heading: "Mosca-branca (Whitefly)",
        content: `Insetos brancos voando quando voce mexe na planta. Sugam seiva e excretam melado.

Tratamento:
- Armadilhas amarelas adesivas
- Sabao de potassio
- Oleo de neem
- Encarsia formosa (controle biologico)

Fique atento ao melado (substancia pegajosa nas folhas) que pode causar fumagina (fungo preto).`,
      },
      {
        heading: "Mofo cinzento (Botrytis / Bud Rot)",
        content: `O pesadelo do grower. Ataca diretamente os buds na floracao.

Sinais: Buds ficando marrons/cinzentos por dentro, folhas de sugar leaves morrendo, cheiro de mofo.

Causa: Umidade acima de 60% + buds densos + pouca ventilacao.

Tratamento: NAO TEM. Remova e descarte todo bud afetado. Nao fume!

Prevencao:
- Umidade abaixo de 50% na flora tardia
- Boa ventilacao entre os buds
- Desfolhe estrategico
- Nao molhe os buds
- Colha antes se o clima nao colaborar`,
      },
      {
        heading: "Fungus Gnats",
        content: `Mosquitinhos pretos voando ao redor do substrato. Larvas comem raizes.

Causa: Solo encharcado constantemente.

Tratamento:
- Deixe o solo secar mais entre regas
- Camada de areia ou perlita no topo do solo
- Armadilhas amarelas adesivas
- Bacillus thuringiensis (BTi) na agua de rega
- Nematoides beneficos

Prevencao: Ciclos de rega adequados, nao deixe prato com agua.`,
      },
    ],
  },
  {
    slug: "training",
    icon: "T",
    bg: "bg-grow-info/10",
    title: "Tecnicas de Treino",
    desc: "LST, topping, FIM, SCROG, defolha",
    sections: [
      {
        heading: "LST (Low Stress Training)",
        content: `Dobrar e amarrar ramos para criar canopy uniforme. Tecnica mais segura.

Como fazer:
1. Quando a planta tiver 4-5 nos, dobre o caule principal para o lado
2. Amarre com arame revestido ou barbante (sem cortar o caule)
3. A medida que novos ramos crescem para cima, va amarrando-os tambem
4. Objetivo: criar uma copa plana onde todos os buds recebem luz igual

Pode fazer em qualquer fase ate a 3a semana de flora. Ideal para autoflowering.`,
      },
      {
        heading: "Topping",
        content: `Cortar a ponta de crescimento principal para criar 2 caules.

Como fazer:
1. Espere a planta ter 4-6 nos
2. Com tesoura esterilizada, corte acima do 3o ou 4o no
3. Dois novos caules vao crescer de cada lado do corte
4. Pode repetir (mainline/manifold)

Recuperacao: 5-7 dias. Nao faca em autoflowering (tempo de veg muito curto).`,
      },
      {
        heading: "FIM (Fuck, I Missed)",
        content: `Similar ao topping, mas cortando apenas 80% da ponta. Pode gerar 3-8 tops em vez de 2.

Como fazer:
1. Mesma preparacao do topping
2. Em vez de cortar rente, corte so a ponta (80% do broto novo)
3. O resultado e menos previsivel que topping mas pode dar mais colas

Menos estresse que topping. Pode tentar em auto se feita bem cedo.`,
      },
      {
        heading: "SCROG (Screen of Green)",
        content: `Tela/rede horizontal sobre as plantas. Objetivo: copa perfeitamente plana.

Como fazer:
1. Instale uma tela com furos de 5-10cm a 30-40cm acima dos vasos
2. A medida que ramos passam pela tela, va tucking (empurrando para baixo e para os lados)
3. Continue ate 70-80% da tela preenchida
4. Mude para 12/12 quando a tela estiver cheia
5. Nas primeiras 2 semanas de flora, continue tucking

Combina perfeitamente com topping e LST. Maximiza o rendimento por m2.`,
      },
      {
        heading: "Defolha",
        content: `Remocao estrategica de folhas para melhorar ventilacao e penetracao de luz.

Quando:
- Vegetativo: Remova folhas que bloqueiam sites de bud
- Inicio da flora (dia 1-3): Remocao leve de folhas grandes
- Dia 21 da flora (lollipop): Remova crescimento inferior que nao recebe luz
- Semanas 5-6: Ultima desfolha para expor buds

Regras:
- Nunca remova mais que 20-30% de uma vez
- Nao desfolhe plantas estressadas ou doentes
- Nao desfolhe autoflowering (exceto folhas mortas)
- Espere recuperacao de 3-5 dias entre sessoes`,
      },
    ],
  },
  {
    slug: "harvest",
    icon: "C",
    bg: "bg-purple-500/10",
    title: "Colheita & Cura",
    desc: "Tricomas, flush, secagem, cura em pote",
    sections: [
      {
        heading: "Quando colher - Tricomas",
        content: `Use uma lupa 60x ou microscopio USB para observar os tricomas:

Transparentes: Muito cedo. Planta ainda esta produzindo THC.
Leitosos/Brancos: Pico de THC. Efeito cerebral, energetico.
Ambar: THC degradando para CBN. Efeito corporal, relaxante, sedativo.

Recomendacao geral:
- Sativa: 70-80% leitoso, 10-20% ambar
- Indica: 50-60% leitoso, 30-40% ambar
- Hibrido: 60-70% leitoso, 20-30% ambar

Observe os tricomas nos BUDS, nao nas sugar leaves (folhas ao redor dos buds amadurecem antes).`,
      },
      {
        heading: "Flush pre-colheita",
        content: `Rega somente com agua pura (pH ajustado) nas ultimas 1-2 semanas.

Objetivo: A planta consome os nutrientes restantes no substrato e nos tecidos, resultando em fumo mais limpo e suave.

Sinais de flush efetivo:
- Folhas fan ficando amarelas (normal!)
- Runoff com EC cada vez menor
- Folhas comecando a cair naturalmente

Em coco/hidro: 7-10 dias de flush
Em solo: 10-14 dias de flush

Algumas escolas defendem que flush nao e necessario. Mas a maioria dos growers concorda que melhora o sabor.`,
      },
      {
        heading: "Corte e trim",
        content: `Dia da colheita:

1. Escureça a planta por 24-48h antes do corte (opcional, pode aumentar producao de resina)
2. Corte ramo por ramo
3. Trim (wet trim ou dry trim):
   - Wet trim: Remova as folhas imediatamente apos o corte. Mais facil, secagem mais rapida.
   - Dry trim: Seque com as folhas e remova depois. Secagem mais lenta e uniforme, melhor sabor.

Guarde as folhas com tricomas (sugar leaves) para fazer hash, manteiga ou edibles.`,
      },
      {
        heading: "Secagem",
        content: `A secagem e tao importante quanto o cultivo.

Ambiente ideal:
- Temperatura: 18-22C
- Umidade: 55-62%
- Escuro total
- Ventilacao suave (nao aponte ventilador nos buds)

Metodo:
- Pendure ramos inteiros de cabeca para baixo
- Espaco entre os ramos para circulacao de ar
- Dura 7-14 dias

Teste: Quando o ramo fino quebra (snap) em vez de dobrar, esta pronto.

NUNCA apresse a secagem com calor ou ventilador direto. Secagem rapida = sabor ruim.`,
      },
      {
        heading: "Cura em potes",
        content: `A cura transforma bud decente em bud excelente.

Material: Potes de vidro (Mason jars), preenchidos 75%.

Processo:
- Semana 1: Abra os potes 2-3x por dia por 10-15 minutos (burping)
- Semana 2: Abra 1-2x por dia
- Semana 3-4: Abra 1x por dia ou a cada 2 dias
- Apos 4 semanas: Cura minima completa. Pode continuar por meses.

Se sentir cheiro de amonia: Buds nao estavam secos o suficiente. Abra os potes e deixe secar mais.

Use sachets de Boveda 62% para manter umidade ideal dentro dos potes.

Cura minima: 2 semanas. Ideal: 4-8 semanas. Perfeita: 2-6 meses.`,
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
