import React, { useState, useEffect } from 'react';
import {
  ChefHat, Sparkles, Send, Clock, X, Bookmark, BookmarkCheck, LogOut,
  Search, Filter, Utensils, BookOpen, Plus, UtensilsCrossed, Star,
  MessageSquare, User, Award, Trash2, Moon, Sun, PlusCircle, MinusCircle,
  ListPlus, CookingPot, Dices, ShoppingCart, CheckSquare, Square, Timer, Play, Pause, RotateCcw, DollarSign, Leaf
} from 'lucide-react';
import './App.css';

const receitasIniciaisExemplo = [
  {
    id: 'ex_1',
    nome: 'Chef Maria Silva',
    criadorId: 'user_ex_maria',
    fotoAutor: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100',
    titulo: 'Lasanha Clássica à Bolonhesa',
    categoria: 'salgado',
    custo: 'moderado',
    tags: ['com-gluten'],
    tempo: '45',
    porcoes: '6',
    desafioSemana: false,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&q=80&w=600&h=400',
    ingredientes: '500g de massa de lasanha\n500g de carne moída\n1 cebola picada\n2 dentes de alho amassados\n800g de molho de tomate\n400g de queijo muçarela\n400g de presunto\nSal e pimenta a gosto',
    preparo: '1. Refogue a cebola e o alho com a carne moída até dourar.\n2. Adicione o molho de tomate, sal, pimenta e deixe apurar por 10 minutos.\n3. Em um refratário, monte as camadas: molho, massa, presunto e muçarela.\n4. Repita as camadas e finalize com queijo.\n5. Leve ao forno preaquecido a 180°C por 30 minutos até gratinar.',
    avaliacoes: [5, 4, 5],
    comentarios: [{ id: 1, autor: 'Carlos Alberto', foto: '', texto: 'Fiz hoje no almoço e a família limpou os pratos! Perfeita.' }]
  },
  {
    id: 'ex_2',
    nome: 'Chef Lucas Andrade',
    criadorId: 'user_ex_lucas',
    fotoAutor: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
    titulo: 'Bolo de Chocolate Vulcão',
    categoria: 'doce',
    custo: 'economico',
    tags: ['sem-lactose'],
    tempo: '30',
    porcoes: '8',
    desafioSemana: false,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600&h=400',
    ingredientes: '3 ovos\n1 xícara de óleo\n1 xícara de leite zero lactose\n1 xícara de açúcar\n1 xícara de chocolate em pó\n2 xícaras de farinha de trigo\n1 colher de sopa de fermento',
    preparo: '1. No liquidificador, bata os ovos, óleo, leite, açúcar e o chocolate.\n2. Transfira para uma tigela e misture a farinha aos poucos.\n3. Adicione o fermento e misture delicadamente.\n4. Despeje em uma forma untada e asse por 35 minutos a 180°C.',
    avaliacoes: [5, 5, 5, 4],
    comentarios: [{ id: 1, autor: 'Mariana Costa', foto: '', texto: 'Esse brigadeiro por cima muda o jogo. Muito bom!' }]
  },
  {
    id: 'ex_3',
    nome: 'Chef Julia Luz',
    criadorId: 'user_ex_julia',
    fotoAutor: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
    titulo: 'Risoto de Tomate Seco com Rúcula',
    categoria: 'salgado',
    custo: 'gourmet',
    tags: ['vegano', 'sem-gluten'],
    tempo: '25',
    porcoes: '3',
    desafioSemana: true, // Marcada para o desafio da semana
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=600&h=400',
    ingredientes: '1 xícara de arroz arbóreo\n1/2 xícara de tomate seco picado\n1 maço de rúcula fresca\n1 cebola pequena picada\n1/2 xícara de vinho branco seco\n1 litro de caldo de legumes quente\nAzeite de oliva\nSal a gosto',
    preparo: '1. Refogue a cebola no azeite até ficar transparente.\n2. Adicione o arroz arbóreo e mexa por 2 minutos.\n3. Despeje o vinho branco e mexha até evaporar.\n4. Adicione o caldo de legumes concha por concha, mexendo sempre à medida que secar.\n5. Quando o arroz estiver al dente, misture o tomate seco e a rúcula. Sirva imediatamente.',
    avaliacoes: [5, 5],
    comentarios: []
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Modais e Menus
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Perfil Customizado
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('Chef de fim de semana apaixonado por testar temperos novos! 🍳');
  const [profilePic, setProfilePic] = useState('');
  const [chefMedals, setChefMedals] = useState([]);

  // Estados do Catálogo
  const [ideias, setIdeias] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [tabAtiva, setTabAtiva] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroRestricao, setFiltroRestricao] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');

  // Formulário de Cadastro
  const [titulo, setTitulo] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [preparo, setPreparo] = useState('');
  const [categoria, setCategoria] = useState('salgado');
  const [custo, setCusto] = useState('moderado');
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);
  const [tempo, setTempo] = useState('');
  const [porcoes, setPorcoes] = useState('');
  const [participarDesafio, setParticiparDesafio] = useState(false);

  // Estados das Funcionalidades Novas
  const [porcoesCalculadora, setPorcoesCalculadora] = useState(1);
  const [listaCompras, setListaCompras] = useState({});
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [timerTempo, setTimerTempo] = useState(0); // em segundos
  const [timerInput, setTimerInput] = useState(10); // minutos padrão

  useEffect(() => {
    const localUser = localStorage.getItem('usuario_logado_local');
    const usuarioAtivo = localUser ? JSON.parse(localUser) : { email: 'chef.visitante@tudonapanela.com', id: 'user_visitante' };
    setUser(usuarioAtivo);
    configurarUsuario(usuarioAtivo);
    fetchIdeias();
  }, []);

  // Monitor do Timer de Cozinha
  useEffect(() => {
    let intervalo = null;
    if (timerAtivo && timerTempo > 0) {
      intervalo = setInterval(() => {
        setTimerTempo(t => t - 1);
      }, 1000);
    } else if (timerTempo === 0 && timerAtivo) {
      setTimerAtivo(false);
      alert('⏰ O tempo acabou! Hora de checar a panela!');
    }
    return () => clearInterval(intervalo);
  }, [timerAtivo, timerTempo]);

  useEffect(() => {
    if (selectedRecipe) {
      setPorcoesCalculadora(Number(selectedRecipe.porcoes));
      // Iniciar lista de compras limpa para a receita aberta
      const linhas = selectedRecipe.ingredientes.split('\n').filter(l => l.trim() !== '');
      const objInicial = {};
      linhas.forEach((lin, i) => { objInicial[i] = { texto: lin, comprado: false }; });
      setListaCompras(objInicial);
      // Sugerir tempo de timer baseado no tempo da receita
      setTimerInput(Number(selectedRecipe.tempo) || 10);
      setTimerTempo(0);
      setTimerAtivo(false);
    }
  }, [selectedRecipe]);

  // Recalcula medalhas dinamicamente com base nas receitas postadas
  useEffect(() => {
    if (!user) return;
    const salvasNestaSessao = JSON.parse(localStorage.getItem('receitas_locais_sessao') || '[]');
    const minhasReceitas = salvasNestaSessao.filter(r => r.criadorId === user.id);

    let conquistas = ['Iniciante 🎯'];
    if (minhasReceitas.length > 0) conquistas.push('Primeira Colherada 🥄');
    if (minhasReceitas.length >= 3) conquistas.push('Chef Executivo ⭐');
    if (minhasReceitas.some(r => r.categoria === 'doce')) conquistas.push('Mestre Confeiteiro 🍰');
    if (minhasReceitas.some(r => r.custo === 'economico')) conquistas.push('Chef Econômico 🪙');
    if (minhasReceitas.some(r => r.desafioSemana)) conquistas.push('Competidor Master 🏆');

    setChefMedals(conquistas);
  }, [ideias, user]);

  const configurarUsuario = (usuario) => {
    const salvoPerfil = localStorage.getItem(`profile_${usuario.id}`);
    if (salvoPerfil) {
      const dados = JSON.parse(salvoPerfil);
      setProfileName(dados.name || usuario.email.split('@')[0]);
      setProfileBio(dados.bio || 'Criando sabores incríveis!');
      setProfilePic(dados.pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${usuario.email}`);
    } else {
      setProfileName(usuario.email.split('@')[0]);
      setProfilePic(`https://api.dicebear.com/7.x/bottts/svg?seed=${usuario.email}`);
    }
    const locaisSalvas = localStorage.getItem(`saved_recipes_${usuario.id}`);
    setSavedRecipes(locaisSalvas ? JSON.parse(locaisSalvas) : []);
  };

  const fetchIdeias = () => {
    const salvasNestaSessao = JSON.parse(localStorage.getItem('receitas_locais_sessao') || '[]');
    setIdeias([...salvasNestaSessao, ...receitasIniciaisExemplo]);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario_logado_local');
    window.location.reload();
  };

  const salvarPerfilCustomizado = (e) => {
    e.preventDefault();
    const dadosPerfil = { name: profileName, bio: profileBio, pic: profilePic };
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(dadosPerfil));
    setShowEditProfileModal(false);
    fetchIdeias();
    alert('Perfil gastronômico atualizado! 🎉');
  };

  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (tipo === 'receita') setImageFile(reader.result);
        if (tipo === 'perfil') setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTagForm = (tag) => {
    if (tagsSelecionadas.includes(tag)) {
      setTagsSelecionadas(tagsSelecionadas.filter(t => t !== tag));
    } else {
      setTagsSelecionadas([...tagsSelecionadas, tag]);
    }
  };

  const handleSubmitReceita = (e) => {
    e.preventDefault();
    if (!titulo.trim() || !ingredientes.trim() || !preparo.trim()) return;

    const novaReceita = {
      id: 'rec_' + Date.now(),
      criadorId: user.id,
      nome: profileName || 'Chef Anônimo',
      fotoAutor: profilePic,
      titulo,
      ingredientes,
      preparo,
      categoria,
      custo,
      tags: tagsSelecionadas,
      tempo: tempo || '30',
      porcoes: porcoes || '4',
      desafioSemana: participarDesafio,
      image: imageFile || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=600&h=400",
      avaliacoes: [],
      comentarios: []
    };

    const salvasNestaSessao = JSON.parse(localStorage.getItem('receitas_locais_sessao') || '[]');
    salvasNestaSessao.unshift(novaReceita);
    localStorage.setItem('receitas_locais_sessao', JSON.stringify(salvasNestaSessao));

    setIdeias(prev => [novaReceita, ...prev]);
    setTitulo('');
    setIngredientes('');
    setPreparo('');
    setImageFile('');
    setTempo('');
    setPorcoes('');
    setTagsSelecionadas([]);
    setParticiparDesafio(false);
    setShowAddModal(false);
    alert('Sua nova receita foi para as panelas do feed! 🚀');
  };

  const deletarReceita = (e, receitaId) => {
    e.stopPropagation();
    if (window.confirm('Quer mesmo apagar essa receita do feed? 🗑️')) {
      const salvasNestaSessao = JSON.parse(localStorage.getItem('receitas_locais_sessao') || '[]');
      const filtradas = salvasNestaSessao.filter(rec => rec.id !== receitaId);
      localStorage.setItem('receitas_locais_sessao', JSON.stringify(filtradas));

      setIdeias(prev => prev.filter(rec => rec.id !== receitaId));
      if (selectedRecipe && selectedRecipe.id === receitaId) setSelectedRecipe(null);
    }
  };

  // ROVALETA CULINÁRIA: SURPREENDA-ME
  const dispararRoletaCulinaria = () => {
    if (ideias.length === 0) return;
    const indexSorteado = Math.floor(Math.random() * ideias.length);
    setSelectedRecipe(ideias[indexSorteado]);
  };

  const toggleSaveRecipe = (e, receita) => {
    e.stopPropagation();
    let listaAtualizada = [...savedRecipes];
    const index = listaAtualizada.findIndex(r => r.id === receita.id);
    if (index >= 0) { listaAtualizada.splice(index, 1); } else { listaAtualizada.push(receita); }
    setSavedRecipes(listaAtualizada);
    localStorage.setItem(`saved_recipes_${user.id}`, JSON.stringify(listaAtualizada));
  };

  const toggleItemCompra = (index) => {
    setListaCompras(prev => ({
      ...prev,
      [index]: { ...prev[index], comprado: !prev[index].comprado }
    }));
  };

  // Controle do Timer Funcional
  const iniciarTimer = () => {
    if (timerTempo === 0) {
      setTimerTempo(timerInput * 60);
    }
    setTimerAtivo(true);
  };
  const pausarTimer = () => setTimerAtivo(false);
  const resetarTimer = () => { setTimerAtivo(false); setTimerTempo(0); };

  const formatarTempoTimer = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const listaFiltrada = (tabAtiva === 'favoritas' ? savedRecipes : ideias).filter(item => {
    const passaTipo = filtroTipo === 'todos' || item.categoria === filtroTipo;
    const passaRestricao = filtroRestricao === 'todos' || (item.tags && item.tags.includes(filtroRestricao));

    const busca = termoBusca.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!busca) return passaTipo && passaRestricao;
    return passaTipo && passaRestricao && (
      (item.titulo || '').toLowerCase().includes(busca) ||
      (item.ingredientes || '').toLowerCase().includes(busca)
    );
  });

  const bgMain = darkMode ? '#121212' : '#fcfbfa';
  const bgCard = darkMode ? '#1e1e1e' : '#fff';
  const textMain = darkMode ? '#f3f4f6' : '#2b2b2b';
  const borderCol = darkMode ? '#2e2e2e' : '#ede8e0';

  return (
    <div style={{ backgroundColor: bgMain, minHeight: '100vh', fontFamily: 'sans-serif', color: textMain, transition: 'background-color 0.2s' }}>

      {/* NAVBAR PRINCIPAL */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', backgroundColor: bgCard, boxShadow: '0 2px 12px rgba(0,0,0,0.03)', position: 'sticky', top: 0, zIndex: 100, borderBottom: `1px solid ${borderCol}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CookingPot style={{ color: '#E05A36' }} size={34} />
          <h1 style={{ fontSize: '23px', fontWeight: '900', color: '#E05A36', margin: 0, letterSpacing: '-0.5px' }}>Tudo na Panela</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* BOTÃO DA ROLETA RUSSA CULINÁRIA */}
          <button onClick={dispararRoletaCulinaria} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)' }}>
            <Dices size={16} /> Surpreenda-me! 🎲
          </button>

          <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E05A36', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', backgroundColor: darkMode ? '#2e2e2e' : '#f3f4f6' }}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#E05A36', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '50px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            <Plus size={16} /> Compartilhar
          </button>

          <div style={{ position: 'relative' }}>
            <img src={profilePic} alt="Chef Avatar" onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #E05A36', cursor: 'pointer', objectFit: 'cover' }} />
            {showProfileMenu && (
              <div style={{ position: 'absolute', right: 0, top: '50px', backgroundColor: bgCard, boxShadow: '0 10px 25px rgba(0,0,0,0.15)', borderRadius: '12px', padding: '16px', minWidth: '240px', zIndex: 110, border: `1px solid ${borderCol}` }}>
                <div style={{ textAlign: 'center', marginBottom: '12px', borderBottom: `1px solid ${borderCol}`, paddingBottom: '12px' }}>
                  <p style={{ margin: 0, fontWeight: '700' }}>{profileName}</p>

                  {/* SEÇÃO VISUAL DE MEDALHAS CONQUISTADAS */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
                    {chefMedals.map((med, i) => (
                      <span key={i} style={{ fontSize: '10px', backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>{med}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setShowEditProfileModal(true); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: 'none', border: 'none', padding: '10px', cursor: 'pointer', color: textMain, fontWeight: '600', fontSize: '13px' }}>
                  <User size={14} /> Customizar Perfil
                </button>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: 'none', border: 'none', padding: '10px', cursor: 'pointer', color: '#dc2626', fontWeight: '600', fontSize: '13px' }}>
                  <LogOut size={14} /> Sair da Conta
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ padding: '30px max(20px, calc((100% - 1100px)/2))' }}>

        {/* BANNER DINÂMICO DE DESAFIO DA SEMANA (MASTERCHEF) */}
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)', borderRadius: '16px', padding: '20px 30px', color: '#fff', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', boxShadow: '0 4px 15px rgba(234,179,8,0.25)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.15)', padding: '4px 10px', borderRadius: '50px', width: 'fit-content', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Award size={13} /> Desafio da Semana #TudoNaPanela
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>O Ingrediente Secreto é: Tomate Seco 🍅</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.95 }}>Crie pratos usando esse item e conquiste a insígnia dourada em seu perfil!</p>
          </div>
          <button onClick={() => { setFiltroTipo('todos'); setTermoBusca('tomate seco'); }} style={{ backgroundColor: '#fff', color: '#b45309', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            Ver Participantes
          </button>
        </div>

        {/* PESQUISA E FILTROS COMPLETO */}
        <div style={{ backgroundColor: bgCard, padding: '20px', borderRadius: '16px', border: `1px solid ${borderCol}`, marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, border: `1px solid ${borderCol}`, padding: '10px 14px', borderRadius: '10px', backgroundColor: darkMode ? '#2e2e2e' : '#faf9f6' }}>
              <Search size={18} style={{ color: '#E05A36' }} />
              <input type="text" placeholder="Busque receitas, temperos ou pratos..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', color: textMain }} />
            </div>
            <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: `1px solid ${borderCol}`, backgroundColor: bgCard, color: textMain, fontWeight: '600', fontSize: '13px' }}>
              <option value="todos">Todos os Sabores</option>
              <option value="salgado">Salgados</option>
              <option value="doce">Doces</option>
            </select>
          </div>

          {/* FILTROS ESPECÍFICOS DE RESTRIÇÃO ALIMENTAR (COISA LEGAL) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', marginRight: '6px', color: '#6b7280' }}><Leaf size={14} style={{ display: 'inline', marginRight: '4px' }} /> Restrições:</span>
            {[
              { id: 'todos', label: 'Nenhuma' },
              { id: 'vegano', label: '🌱 Vegano' },
              { id: 'sem-gluten', label: '🍞 Sem Glúten' },
              { id: 'sem-lactose', label: '🥛 Sem Lactose' },
              { id: 'fit', label: '💪 Fit / Low Carb' }
            ].map(rest => (
              <button key={rest.id} onClick={() => setFiltroRestricao(rest.id)} style={{ padding: '6px 12px', borderRadius: '50px', border: '1px solid', borderColor: filtroRestricao === rest.id ? '#E05A36' : borderCol, backgroundColor: filtroRestricao === rest.id ? '#E05A36' : 'transparent', color: filtroRestricao === rest.id ? '#fff' : textMain, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                {rest.label}
              </button>
            ))}
          </div>
        </div>

        {/* ABAS EXPLORAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${borderCol}`, paddingBottom: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setTabAtiva('todas')} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: '800', cursor: 'pointer', color: tabAtiva === 'todas' ? '#E05A36' : '#9ca3af', borderBottom: tabAtiva === 'todas' ? '3px solid #E05A36' : 'none', paddingBottom: '12px', marginBottom: '-15px' }}>Cardápio Geral</button>
            <button onClick={() => setTabAtiva('favoritas')} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: '800', cursor: 'pointer', color: tabAtiva === 'favoritas' ? '#E05A36' : '#9ca3af', borderBottom: tabAtiva === 'favoritas' ? '3px solid #E05A36' : 'none', paddingBottom: '12px', marginBottom: '-15px' }}>Minhas Panelas Salvas</button>
          </div>
        </div>

        {/* GRID DE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '24px' }}>
          {listaFiltrada.map(item => {
            const isSaved = savedRecipes.some(r => r.id === item.id);
            const eDono = item.criadorId === user?.id;

            return (
              <div key={item.id} onClick={() => setSelectedRecipe(item)} style={{ backgroundColor: bgCard, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${borderCol}`, cursor: 'pointer', position: 'relative' }}>

                {/* BOTÕES FLUTUANTES */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', gap: '6px' }}>
                  {eDono && (
                    <button onClick={(e) => deletarReceita(e, item.id)} style={{ backgroundColor: '#ffeded', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                  <button onClick={(e) => toggleSaveRecipe(e, item)} style={{ backgroundColor: bgCard, border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                    {isSaved ? <BookmarkCheck size={16} fill="#E05A36" stroke="#E05A36" /> : <Bookmark size={16} />}
                  </button>
                </div>

                {/* BANNER INDICANDO SE É DO DESAFIO */}
                {item.desafioSemana && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, backgroundColor: '#f59e0b', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' }}>
                    🏆 DESAFIO
                  </div>
                )}

                <div style={{ height: '180px' }}>
                  <img src={item.image} alt={item.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ padding: '16px' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800' }}>{item.titulo}</h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#9ca3af' }}>Por: {item.nome}</p>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: `1px solid ${borderCol}`, paddingTop: '10px', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}><Clock size={12} /> {item.tempo} min</span>
                    <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px', color: '#16a34a' }}><Utensils size={12} /> {item.porcoes} porç.</span>

                    {/* INDICADOR DE CUSTO FINANCEIRO */}
                    <span style={{ marginLeft: 'auto', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', fontSize: '10px' }}>
                      {item.custo === 'economico' ? '$ Econômico' : item.custo === 'moderado' ? '$$ Moderado' : '$$$ Gourmet'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL CADASTRO DE RECEITA */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div style={{ backgroundColor: bgCard, width: '100%', maxWidth: '540px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Adicionar Receita na Panela</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmitReceita} style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Título do Prato</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Risoto Fácil" style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain }} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Tempo (min)</label>
                  <input type="number" value={tempo} onChange={(e) => setTempo(e.target.value)} placeholder="30" style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Rendimento (Porções)</label>
                  <input type="number" value={porcoes} onChange={(e) => setPorcoes(e.target.value)} placeholder="4" style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain }} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Categoria</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain }}>
                    <option value="salgado">Salgado</option>
                    <option value="doce">Doce</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Custo Estimado</label>
                  <select value={custo} onChange={(e) => setCusto(e.target.value)} style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain }}>
                    <option value="economico">Econômico ($)</option>
                    <option value="moderado">Moderado ($$)</option>
                    <option value="gourmet">Gourmet ($$$)</option>
                  </select>
                </div>
              </div>

              {/* SELEÇÃO MULTIPLA DE TAGS DE RESTRIÇÃO NO ENVIO */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Tags de Saúde / Restrição</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['vegano', 'sem-gluten', 'sem-lactose', 'fit'].map(t => {
                    const ativo = tagsSelecionadas.includes(t);
                    return (
                      <button type="button" key={t} onClick={() => toggleTagForm(t)} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid', borderColor: ativo ? '#E05A36' : borderCol, backgroundColor: ativo ? '#E05A36' : 'transparent', color: ativo ? '#fff' : textMain, fontSize: '11px', cursor: 'pointer' }}>{t}</button>
                    );
                  })}
                </div>
              </div>

              {/* CHECKBOX SE ENTRA NO DESAFIO MASTERCHEF */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: '#fef3c7', borderRadius: '8px', marginTop: '4px' }}>
                <input type="checkbox" id="checkDesafio" checked={participarDesafio} onChange={(e) => setParticiparDesafio(e.target.checked)} />
                <label htmlFor="checkDesafio" style={{ fontSize: '11px', fontWeight: '700', color: '#b45309', cursor: 'pointer' }}>✨ Essa receita faz parte do Desafio da Semana (Tomate Seco)!</label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Foto URL ou Upload (Opcional)</label>
                <input type="text" placeholder="https://..." value={imageFile} onChange={(e) => setImageFile(e.target.value)} style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Ingredientes (Um por linha)</label>
                <textarea rows={3} value={ingredientes} onChange={(e) => setIngredientes(e.target.value)} placeholder="Ex:\n2 batatas picadas\n1 colher de sal" style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain, fontFamily: 'sans-serif' }} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Modo de Preparo</label>
                <textarea rows={3} value={preparo} onChange={(e) => setPreparo(e.target.value)} placeholder="1. Cozinhe as batatas..." style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain, fontFamily: 'sans-serif' }} required />
              </div>

              <button type="submit" style={{ backgroundColor: '#E05A36', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' }}>Lançar na Panela</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALHE COMPLETO */}
      {selectedRecipe && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 190, padding: '20px' }}>
          <div style={{ backgroundColor: bgCard, borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative', border: `1px solid ${borderCol}` }}>
            <button onClick={() => setSelectedRecipe(null)} style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 20, backgroundColor: bgCard, border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', color: textMain }}><X size={16} /></button>

            <div style={{ height: '180px', position: 'relative', flexShrink: 0 }}>
              <img src={selectedRecipe.image} alt={selectedRecipe.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '16px', color: '#fff', zIndex: 5 }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{selectedRecipe.titulo}</h3>
              </div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* TIMER DE COZINHA EXCLUSIVO INTERATIVO */}
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e40af' }}>
                  <Timer size={18} />
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>Timer Interativo:</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '800' }}>
                    {timerTempo > 0 ? formatarTempoTimer(timerTempo) : `${timerInput}:00`}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {!timerAtivo ? (
                    <button onClick={iniciarTimer} style={{ backgroundColor: '#1d4ed8', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}><Play size={10} /> Iniciar</button>
                  ) : (
                    <button onClick={pausarTimer} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}><Pause size={10} /> Pausar</button>
                  )}
                  <button onClick={resetarTimer} style={{ backgroundColor: '#6b7280', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}><RotateCcw size={10} /></button>
                </div>
              </div>

              {/* PORÇÕES DINÂMICAS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <span>Ajustar Porções na Panela:</span>
                <button onClick={() => setPorcoesCalculadora(p => Math.max(1, p - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E05A36' }}><MinusCircle size={16} /></button>
                <strong>{porcoesCalculadora}</strong>
                <button onClick={() => setPorcoesCalculadora(p => p + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E05A36' }}><PlusCircle size={16} /></button>
              </div>

              {porcoesCalculadora !== Number(selectedRecipe.porcoes) && (
                <div style={{ padding: '6px', backgroundColor: '#fff7ed', borderRadius: '6px', fontSize: '11px', color: '#c2410c', fontWeight: '700', textAlign: 'center' }}>
                  ⚠️ Multiplicador ativo! Ajuste as medidas na hora de separar.
                </div>
              )}

              {/* LISTA DE COMPRAS INTERATIVA COM CHECKBOX */}
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '800', color: '#E05A36', display: 'flex', alignItems: 'center', gap: '4px' }}><ShoppingCart size={14} /> Lista de Compras da Receita</h4>
                <div style={{ backgroundColor: darkMode ? '#2e2e2e' : '#fafafa', padding: '10px 14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {Object.keys(listaCompras).map((chave) => {
                    const item = listaCompras[chave];
                    return (
                      <div key={chave} onClick={() => toggleItemCompra(chave)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', textDecoration: item.comprado ? 'line-through' : 'none', opacity: item.comprado ? 0.5 : 1 }}>
                        {item.comprado ? <CheckSquare size={15} style={{ color: '#16a34a' }} /> : <Square size={15} />}
                        <span>{item.texto}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '800', color: '#16a34a' }}><ListPlus size={14} style={{ display: 'inline', marginRight: '4px' }} /> Instruções de Preparo</h4>
                <div style={{ fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {selectedRecipe.preparo}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERFIL */}
      {showEditProfileModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 220 }}>
          <div style={{ backgroundColor: bgCard, padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '380px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800' }}>Configurar Cozinha do Chef</h3>
            <form onSubmit={salvarPerfilCustomizado} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Seu Apelido Chef</label>
                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Sua Bio</label>
                <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} style={{ width: '100%', padding: '10px', border: `1px solid ${borderCol}`, borderRadius: '8px', backgroundColor: bgCard, color: textMain, fontFamily: 'sans-serif' }} required />
              </div>
              <button type="submit" style={{ backgroundColor: '#E05A36', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Salvar</button>
            </form>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '20px', color: '#a3a3a3', fontSize: '11px', borderTop: `1px solid ${borderCol}`, backgroundColor: bgCard, marginTop: '40px' }}>
        <p>&copy; 2026 Tudo na Panela - Todas as receitas em um só lugar.</p>
      </footer>
    </div>
  );
}

export default App;
