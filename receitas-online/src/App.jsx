import React, { useState, useEffect } from 'react';
import { Star, Trash2, User, PlusCircle, Sparkles, X, Heart, MessageSquare, Camera, LogIn, UserPlus, LogOut, Lock, Mail } from 'lucide-react';

export default function App() {
  // --- ESTADO DE AUTENTICAÇÃO ---
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem('usuario_sessao');
    return salvo ? JSON.parse(salvo) : null;
  });

  // Controles da tela de Login/Cadastro
  const [telaAuth, setTelaAuth] = useState('login'); // 'login' ou 'cadastro'
  const [formAuth, setFormAuth] = useState({ nome: '', email: '', senha: '' });
  const [erroAuth, setErroAuth] = useState('');

  // --- ESTADOS DO SISTEMA DE RECEITAS ---
  const [receitas, setReceitas] = useState(() => {
    const salvas = localStorage.getItem('receitas_panela');
    if (salvas) return JSON.parse(salvas);
    return [
      {
        id: 1,
        titulo: 'Lasanha à Bolonhesa',
        chef: 'Chef Lucas',
        categoria: 'Massas',
        imagem: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&auto=format&fit=crop&q=60',
        ingredientes: ['Massa de lasanha', '500g de carne moída', 'Molho de tomate', 'Presunto e Queijo', 'Molho branco'],
        preparo: 'Cozinhe a carne, monte as camadas alternando massa, carne, presunto e queijo. Leve ao forno por 30 minutos.',
        criadoPorUsuario: false,
        comentarios: [
          { id: 1, usuario: 'Mariana', nota: 5, texto: 'Melhor lasanha que já fiz! Maravilhosa.' }
        ]
      },
      {
        id: 2,
        titulo: 'Bolo de Cenoura Fofinho',
        chef: 'Chef Ju',
        categoria: 'Doces',
        imagem: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&auto=format&fit=crop&q=60',
        ingredientes: ['3 cenouras', '4 ovos', '2 xícaras de açúcar', '2 xícaras de farinha', '1 xícara de óleo', 'Chocolate para a cobertura'],
        preparo: 'Bata a cenoura, ovos e óleo no liquidificador. Misture o açúcar e farinha. Asse por 40 min e cubra com chocolate.',
        criadoPorUsuario: false,
        comentarios: [
          { id: 1, usuario: 'Carlos', nota: 4, texto: 'Ficou muito fofinho, mas achei um pouco doce.' }
        ]
      }
    ];
  });

  const [perfil, setPerfil] = useState(() => {
    const salvo = localStorage.getItem('perfil_panela');
    return salvo ? JSON.parse(salvo) : {
      nome: 'Seu Nome de Chef',
      bio: 'Apaixonado por panelas e temperos.',
      foto: ''
    };
  });

  // Modais e Controles de Tela
  const [receitaAtiva, setReceitaAtiva] = useState(null);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  // Formulários
  const [novaReceita, setNovaReceita] = useState({ titulo: '', categoria: 'Almoço', ingredientes: '', preparo: '', imagem: '' });
  const [novoComentario, setNovoComentario] = useState({ texto: '', nota: 5 });
  const [nomeTemp, setNomeTemp] = useState(perfil.nome);
  const [bioTemp, setBioTemp] = useState(perfil.bio);
  const [fotoTemp, setFotoTemp] = useState(perfil.foto);

  // Sincroniza o Perfil com o nome do usuário logado se ele for alterado
  useEffect(() => {
    if (usuarioLogado && perfil.nome === 'Seu Nome de Chef') {
      setPerfil(prev => ({ ...prev, nome: usuarioLogado.nome }));
    }
  }, [usuarioLogado]);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('receitas_panela', JSON.stringify(receitas));
  }, [receitas]);

  useEffect(() => {
    localStorage.setItem('perfil_panela', JSON.stringify(perfil));
  }, [perfil]);

  // --- FUNÇÕES DE AUTENTICAÇÃO (LOGIN / CADASTRO) ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErroAuth('');

    if (telaAuth === 'cadastro') {
      if (!formAuth.nome || !formAuth.email || !formAuth.senha) {
        setErroAuth('Preencha todos os campos.');
        return;
      }

      // Criar conta e salvar banco de usuários local
      const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios_cadastrados') || '[]');
      const emailExiste = usuariosExistentes.some(u => u.email === formAuth.email);

      if (emailExiste) {
        setErroAuth('Este e-mail já está cadastrado.');
        return;
      }

      const novoUsuario = { nome: formAuth.nome, email: formAuth.email, senha: formAuth.senha };
      usuariosExistentes.push(novoUsuario);
      localStorage.setItem('usuarios_cadastrados', JSON.stringify(usuariosExistentes));

      // Logar automaticamente após cadastrar
      localStorage.setItem('usuario_sessao', JSON.stringify(novoUsuario));
      setPerfil(prev => ({ ...prev, nome: novoUsuario.nome }));
      setUsuarioLogado(novoUsuario);
    } else {
      // Login
      const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios_cadastrados') || '[]');
      const usuarioEncontrado = usuariosExistentes.find(u => u.email === formAuth.email && u.senha === formAuth.senha);

      if (!usuarioEncontrado) {
        setErroAuth('E-mail ou senha incorretos.');
        return;
      }

      localStorage.setItem('usuario_sessao', JSON.stringify(usuarioEncontrado));
      setPerfil(prev => ({ ...prev, nome: usuarioEncontrado.nome }));
      setUsuarioLogado(usuarioEncontrado);
    }

    // Limpar formulário
    setFormAuth({ nome: '', email: '', senha: '' });
  };

  const handleLogout = () => {
    if (confirm('Deseja mesmo sair da sua conta?')) {
      localStorage.removeItem('usuario_sessao');
      setUsuarioLogado(null);
    }
  };

  // --- FUNÇÕES AUXILIARES DE IMAGEM ---
  const converterImagemParaBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  // --- AÇÕES DO SISTEMA ---
  const handleCriarReceita = (e) => {
    e.preventDefault();
    if (!novaReceita.titulo || !novaReceita.ingredientes || !novaReceita.preparo) return;

    const nova = {
      id: Date.now(),
      titulo: novaReceita.titulo,
      chef: perfil.nome,
      categoria: novaReceita.categoria,
      imagem: novaReceita.imagem || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&auto=format&fit=crop&q=60',
      ingredientes: novaReceita.ingredientes.split('\n').filter(i => i.trim() !== ''),
      preparo: novaReceita.preparo,
      criadoPorUsuario: true,
      comentarios: []
    };

    setReceitas([nova, ...receitas]);
    setNovaReceita({ titulo: '', categoria: 'Almoço', ingredientes: '', preparo: '', imagem: '' });
    setModalCriarAberto(false);
  };

  const handleExcluirReceita = (id, e) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja apagar essa receita preciosa?')) {
      setReceitas(receitas.filter(r => r.id !== id));
      if (receitaAtiva && receitaAtiva.id === id) setReceitaAtiva(null);
    }
  };

  const handleAdicionarComentario = (e) => {
    e.preventDefault();
    if (!novoComentario.texto.trim()) return;

    const comentario = {
      id: Date.now(),
      usuario: perfil.nome,
      nota: novoComentario.nota,
      texto: novoComentario.texto
    };

    const receitasAtualizadas = receitas.map(r => {
      if (r.id === receitaAtiva.id) {
        return { ...r, comentarios: [...r.comentarios, comentario] };
      }
      return r;
    });

    setReceitas(receitasAtualizadas);
    setReceitaAtiva(receitasAtualizadas.find(r => r.id === receitaAtiva.id));
    setNovoComentario({ texto: '', nota: 5 });
  };

  const handleSalvarPerfil = (e) => {
    e.preventDefault();
    setPerfil({ nome: nomeTemp, bio: bioTemp, foto: fotoTemp });
    setModalPerfilAberto(false);
  };

  const rodarRoletaSurpresa = () => {
    if (receitas.length === 0) return;
    const indiceSorteado = Math.floor(Math.random() * receitas.length);
    setReceitaAtiva(receitas[indiceSorteado]);
  };

  const calcularMediaNotas = (comentarios) => {
    if (!comentarios || comentarios.length === 0) return 0;
    const soma = comentarios.reduce((acc, c) => acc + c.nota, 0);
    return (soma / comentarios.length).toFixed(1);
  };

  const receitasFiltradas = filtroCategoria === 'Todas'
    ? receitas
    : receitas.filter(r => r.categoria === filtroCategoria);

  // --- RENDERIZAÇÃO DA TELA DE LOGIN/CADASTRO CASO NÃO LOGADO ---
  if (!usuarioLogado) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-orange-100">

          {/* Cabeçalho do Card Auth */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-center text-white">
            <span className="text-4xl block mb-2">🍳</span>
            <h2 className="text-2xl font-black tracking-tight">TUDO NA PANELA</h2>
            <p className="text-orange-100 text-sm mt-1">Sua rede social de receitas favorita</p>
          </div>

          {/* Formulário */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
              {telaAuth === 'login' ? 'Bem-vindo de volta, Chef!' : 'Crie sua conta de Chef'}
            </h3>

            {erroAuth && (
              <div className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold p-3 rounded-xl mb-4 text-center">
                {erroAuth}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {telaAuth === 'cadastro' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Ex: Lucas Silva"
                      value={formAuth.nome}
                      onChange={(e) => setFormAuth({ ...formAuth, nome: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={formAuth.email}
                    onChange={(e) => setFormAuth({ ...formAuth, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formAuth.senha}
                    onChange={(e) => setFormAuth({ ...formAuth, senha: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-6"
              >
                {telaAuth === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                <span>{telaAuth === 'login' ? 'Entrar no Painel' : 'Concluir Cadastro'}</span>
              </button>
            </form>

            {/* Alternador de Telas */}
            <div className="text-center mt-6 border-t border-slate-100 pt-4">
              {telaAuth === 'login' ? (
                <p className="text-sm text-slate-600">
                  Não tem uma conta?{' '}
                  <button onClick={() => { setTelaAuth('cadastro'); setErroAuth(''); }} className="text-orange-600 font-bold hover:underline">
                    Cadastre-se aqui
                  </button>
                </p>
              ) : (
                <p className="text-sm text-slate-600">
                  Já possui cadastro?{' '}
                  <button onClick={() => { setTelaAuth('login'); setErroAuth(''); }} className="text-orange-600 font-bold hover:underline">
                    Faça login
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO DA PÁGINA PRINCIPAL DO APP (APÓS LOGIN) ---
  return (
    <div className="min-h-screen bg-orange-50 text-slate-800 font-sans">

      {/* HEADER */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFiltroCategoria('Todas')}>
            <span className="text-3xl">🍳</span>
            <h1 className="text-2xl font-black text-orange-600 tracking-tight">TUDO NA PANELA</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={rodarRoletaSurpresa}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-2 rounded-full flex items-center gap-2 shadow-sm transition text-xs md:text-sm"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">Surpreenda-me!</span>
            </button>

            {/* Avatar do Perfil */}
            <button
              onClick={() => {
                setNomeTemp(perfil.nome);
                setBioTemp(perfil.bio);
                setFotoTemp(perfil.foto);
                setModalPerfilAberto(true);
              }}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 p-2 rounded-full md:rounded-lg border border-slate-200 transition"
            >
              {perfil.foto ? (
                <img src={perfil.foto} alt="Perfil" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700">
                  <User size={18} />
                </div>
              )}
              <span className="hidden md:block text-sm font-semibold max-w-[120px] truncate">{perfil.nome}</span>
            </button>

            {/* Botão Sair */}
            <button
              onClick={handleLogout}
              className="bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 p-2.5 rounded-full border border-slate-200 transition"
              title="Sair da Conta"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* BANNER DE BOAS VINDAS */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 md:p-10 text-white shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-2">O que vamos cozinhar hoje, {perfil.nome}?</h2>
            <p className="text-orange-100 font-medium max-w-xl">"{perfil.bio}"</p>
          </div>
          <button
            onClick={() => setModalCriarAberto(true)}
            className="w-full md:w-auto bg-white hover:bg-orange-50 text-orange-600 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition whitespace-nowrap"
          >
            <PlusCircle size={22} />
            Compartilhar Receita
          </button>
        </div>

        {/* FILTROS POR CATEGORIA */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {['Todas', 'Almoço', 'Massas', 'Sobremesas', 'Lanches', 'Doces', 'Saudável'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition whitespace-nowrap ${
                filtroCategoria === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-orange-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE RECEITAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {receitasFiltradas.map((receita) => {
            const media = calcularMediaNotas(receita.comentarios);
            return (
              <div
                key={receita.id}
                onClick={() => setRecipeActive(receita)} // Correção da função aqui
                onClick={() => setReceitaAtiva(receita)}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer relative flex flex-col group"
              >
                {/* Imagem do Prato */}
                <div className="h-48 w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={receita.imagem}
                    alt={receita.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm">
                    {receita.categoria}
                  </span>

                  {/* Botão de Deletar */}
                  {receita.criadoPorUsuario && (
                    <button
                      onClick={(e) => handleExcluirReceita(receita.id, e)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition hover:scale-110"
                      title="Excluir minha receita"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Info do Card */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1 mb-1">{receita.titulo}</h3>
                    <p className="text-xs text-slate-500 mb-3">Por: <span className="font-semibold text-slate-700">{receita.chef}</span></p>
                  </div>

                  {/* Avaliação e Comentários Simplificados */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={16} fill={media > 0 ? "currentColor" : "none"} />
                      <span className="text-sm font-bold text-slate-700">{media > 0 ? media : 'Sem notas'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <MessageSquare size={16} />
                      <span className="text-sm font-medium">{receita.comentarios?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {receitasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-2">🍽️</span>
            <p className="text-slate-500 font-medium">Nenhuma receita encontrada nessa categoria.</p>
          </div>
        )}
      </main>

      {/* --- MODAL: DETALHES DA RECEITA --- */}
      {receitaAtiva && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">

            <div className="h-64 w-full relative bg-slate-100">
              <img src={receitaAtiva.imagem} alt={receitaAtiva.titulo} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <div>
                  <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">{receitaAtiva.categoria}</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white mt-2">{receitaAtiva.titulo}</h2>
                  <p className="text-sm text-orange-200 font-medium">Criado por: {receitaAtiva.chef}</p>
                </div>
              </div>
              <button
                onClick={() => setReceitaAtiva(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-md transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-extrabold text-lg text-orange-600 mb-2 flex items-center gap-2">📝 Ingredientes</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {receitaAtiva.ingredientes.map((ing, i) => (
                    <li key={i} className="bg-slate-50 p-2 rounded-lg text-sm border border-slate-100 flex items-center gap-2">
                      <span className="text-orange-400 font-bold">•</span> {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h4 className="font-extrabold text-lg text-orange-600 mb-2">🍳 Modo de Preparo</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-orange-50/50 p-4 rounded-xl border border-orange-100/60 whitespace-pre-line">
                  {receitaAtiva.preparo}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-extrabold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  ⭐ Avaliações ({receitaAtiva.comentarios?.length || 0})
                </h4>

                <div className="space-y-3 mb-6">
                  {receitaAtiva.comentarios?.map((com) => (
                    <div key={com.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-slate-800">{com.usuario}</span>
                        <div className="flex gap-0.5 text-amber-500">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} size={14} fill={idx < com.nota ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{com.texto}</p>
                    </div>
                  ))}
                  {(!receitaAtiva.comentarios || receitaAtiva.comentarios.length === 0) && (
                    <p className="text-sm text-slate-400 italic">Ninguém avaliou esse prato ainda. Seja o primeiro!</p>
                  )}
                </div>

                <form onSubmit={handleAdicionarComentario} className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deixe sua opinião de Chef:</p>

                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm text-slate-600 mr-2">Sua nota:</span>
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <button
                        type="button"
                        key={estrela}
                        onClick={() => setNovoComentario({ ...novoComentario, nota: estrela })}
                        className="text-amber-500 hover:scale-110 transition"
                      >
                        <Star size={22} fill={estrela <= novoComentario.nota ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="O que achou do sabor?"
                      value={novoComentario.texto}
                      onChange={(e) => setNovoComentario({ ...novoComentario, texto: e.target.value })}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                      required
                    />
                    <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition">
                      Avaliar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: COMPARTILHAR RECEITA --- */}
      {modalCriarAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalCriarAberto(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">🚀 Compartilhar Receita</h3>

            <form onSubmit={handleCriarReceita} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Título do Prato</label>
                <input
                  type="text"
                  placeholder="Ex: Torta de Frango"
                  value={novaReceita.titulo}
                  onChange={(e) => setNovaReceita({ ...novaReceita, titulo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Categoria</label>
                  <select
                    value={novaReceita.categoria}
                    onChange={(e) => setNovaReceita({ ...novaReceita, categoria: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2.5 text-sm focus:outline-none"
                  >
                    {['Almoço', 'Massas', 'Sobremesas', 'Lanches', 'Doces', 'Saudável'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Foto do Prato</label>
                  <label className="w-full bg-slate-100 border border-dashed border-slate-300 rounded-xl px-2 py-2 flex items-center justify-center gap-2 text-xs cursor-pointer h-[42px]">
                    <Camera size={16} />
                    <span className="truncate">{novaReceita.imagem ? 'Foto Escolhida!' : 'Abrir Galeria'}</span>
                    <input
                      type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        if(e.target.files[0]) {
                          converterImagemParaBase64(e.target.files[0], (base64) => setNovaReceita({ ...novaReceita, imagem: base64 }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Ingredientes (um por linha)</label>
                <textarea
                  rows="3" placeholder="1 Xícara de trigo&#10;2 Ovos"
                  value={novaReceita.ingredientes}
                  onChange={(e) => setNovaReceita({ ...novaReceita, ingredientes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Modo de Preparo</label>
                <textarea
                  rows="4" placeholder="Explique o passo a passo..."
                  value={novaReceita.preparo}
                  onChange={(e) => setNovaReceita({ ...novaReceita, preparo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md">
                Publicar no Feed
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CUSTOMIZAR PERFIL --- */}
      {modalPerfilAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button onClick={() => setModalPerfilAberto(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">👨‍🍳 Customizar Perfil de Chef</h3>

            <form onSubmit={handleSalvarPerfil} className="space-y-4">
              <div className="flex flex-col items-center gap-2 mb-2">
                <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-orange-500 relative overflow-hidden flex items-center justify-center shadow-inner">
                  {fotoTemp ? <img src={fotoTemp} alt="Preview" className="w-full h-full object-cover" /> : <User size={36} className="text-slate-400" />}
                </div>
                <label className="bg-slate-100 border rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer flex items-center gap-1">
                  <Camera size={14} /> Mudar Foto
                  <input
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      if(e.target.files[0]) {
                        converterImagemParaBase64(e.target.files[0], (base64) => setFotoTemp(base64));
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome Gastronômico</label>
                <input
                  type="text" value={nomeTemp} onChange={(e) => setNomeTemp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Minha Bio / Frase de Cozinha</label>
                <textarea
                  rows="2" value={bioTemp} onChange={(e) => setBioTemp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md">
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
