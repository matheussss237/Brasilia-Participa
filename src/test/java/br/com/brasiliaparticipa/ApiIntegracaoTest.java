package br.com.brasiliaparticipa;

import br.com.brasiliaparticipa.repository.DemandaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testa a API "de ponta a ponta": sobe o Spring inteiro com um MongoDB em memória
 * e faz requisições HTTP simuladas, como o navegador faria.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(MongoEmbutidoConfig.class)
class ApiIntegracaoTest {

    private static final byte[] PNG_MINIMO = {
            (byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0x0D, 'I', 'H', 'D', 'R'};

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JsonMapper json;

    @Autowired
    private DemandaRepository demandaRepository;

    // ------------------------------------------------------------ utilitários

    private MockHttpSession login(String email, String senha) throws Exception {
        MockHttpSession sessao = new MockHttpSession();
        mvc.perform(post("/api/auth/login").session(sessao).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"senha\":\"" + senha + "\"}"))
                .andExpect(status().isOk());
        return sessao;
    }

    private MockHttpSession cadastrar(String email) throws Exception {
        MockHttpSession sessao = new MockHttpSession();
        mvc.perform(post("/api/auth/cadastro").session(sessao).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Maria Teste\",\"email\":\"" + email + "\",\"senha\":\"senha123\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.perfil").value("CIDADAO"));
        return sessao;
    }

    private JsonNode ler(MvcResult resultado) throws Exception {
        return json.readTree(resultado.getResponse().getContentAsString(StandardCharsets.UTF_8));
    }

    private MockMultipartFile dadosDemanda(String titulo, double lat, double lng) {
        String corpo = """
                {"titulo":"%s","descricao":"Descrição de teste com mais de dez caracteres.",
                 "categoria":"Iluminação","regiao":"Gama","endereco":"Quadra 1","latitude":%s,"longitude":%s}
                """.formatted(titulo, lat, lng);
        return new MockMultipartFile("dados", "", MediaType.APPLICATION_JSON_VALUE,
                corpo.getBytes(StandardCharsets.UTF_8));
    }

    // ------------------------------------------------------------ testes

    @Test
    void dadosIniciaisSaoCriadosEListadosSemLogin() throws Exception {
        mvc.perform(get("/api/demandas").param("tamanho", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(22))
                .andExpect(jsonPath("$.itens.length()").value(5))
                .andExpect(jsonPath("$.temMais").value(true));
    }

    @Test
    void filtrosEBuscaFuncionam() throws Exception {
        mvc.perform(get("/api/demandas").param("status", "RESOLVIDA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.itens[*].status").value(org.hamcrest.Matchers.everyItem(
                        org.hamcrest.Matchers.is("RESOLVIDA"))));

        // Busca sem diferenciar maiúsculas e tratando o texto como literal (não como regex)
        mvc.perform(get("/api/demandas").param("q", "SEMÁFORO"))
                .andExpect(jsonPath("$.total").value(1));
        mvc.perform(get("/api/demandas").param("q", ".*"))
                .andExpect(jsonPath("$.total").value(0));

        mvc.perform(get("/api/demandas").param("ordenar", "apoios").param("tamanho", "1"))
                .andExpect(jsonPath("$.itens[0].totalApoios").value(67));
    }

    @Test
    void estatisticasEReferencias() throws Exception {
        mvc.perform(get("/api/estatisticas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").isNumber())
                .andExpect(jsonPath("$.porStatus.length()").value(4))
                .andExpect(jsonPath("$.porRegiao[0].regiao").isString())
                .andExpect(jsonPath("$.porMes.length()").value(6))
                .andExpect(jsonPath("$.tempoMedioResolucaoDias").isNumber());

        mvc.perform(get("/api/referencias"))
                .andExpect(jsonPath("$.categorias.length()").value(9))
                .andExpect(jsonPath("$.regioes.length()").value(33));
    }

    @Test
    void naoLogadoNaoPodeCriarNemApoiar() throws Exception {
        String id = demandaRepository.findAll().getFirst().getId();
        mvc.perform(post("/api/demandas/" + id + "/apoio").with(csrf()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensagem").value("Faça login para continuar."));
    }

    @Test
    void semTokenCsrfARequisicaoEBloqueada() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"cidadao@email.com\",\"senha\":\"cidadao123\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void loginComSenhaErradaDevolve401() throws Exception {
        mvc.perform(post("/api/auth/login").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"cidadao@email.com\",\"senha\":\"errada\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensagem").value("E-mail ou senha incorretos."));
    }

    @Test
    void cadastroValidaCamposEImpedeEmailRepetido() throws Exception {
        mvc.perform(post("/api/auth/cadastro").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"A\",\"email\":\"invalido\",\"senha\":\"1\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").exists())
                .andExpect(jsonPath("$.campos.email").exists())
                .andExpect(jsonPath("$.campos.senha").exists());

        cadastrar("repetido@email.com");
        mvc.perform(post("/api/auth/cadastro").with(csrf()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Outra\",\"email\":\"REPETIDO@email.com\",\"senha\":\"senha123\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void fluxoCompletoDoCidadaoEDoAdmin() throws Exception {
        MockHttpSession cidadao = cadastrar("fluxo@email.com");

        mvc.perform(get("/api/auth/sessao").session(cidadao))
                .andExpect(jsonPath("$.logado").value(true))
                .andExpect(jsonPath("$.usuario.email").value("fluxo@email.com"));

        // 1) Cria demanda com foto
        MockMultipartFile foto = new MockMultipartFile("foto", "foto.png", "image/png", PNG_MINIMO);
        MvcResult criada = mvc.perform(multipart("/api/demandas")
                        .file(dadosDemanda("Poste queimado na rua 3", -16.0100, -48.0600)).file(foto)
                        .session(cidadao).with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("RECEBIDA"))
                .andExpect(jsonPath("$.autorNome").value("Maria Teste"))
                .andReturn();
        JsonNode demanda = ler(criada);
        String id = demanda.get("id").asString();
        String fotoUrl = demanda.get("fotoUrl").asString();
        assertThat(fotoUrl).startsWith("/api/fotos/");

        mvc.perform(get(fotoUrl))
                .andExpect(status().isOk())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers
                        .content().contentType("image/png"));

        // 2) Outra pessoa marca um ponto a ~50 m: o sistema sugere a demanda existente
        mvc.perform(get("/api/demandas/proximas").param("lat", "-16.0104").param("lng", "-48.0600")
                        .param("categoria", "Iluminação"))
                .andExpect(jsonPath("$[0].demanda.id").value(id))
                .andExpect(jsonPath("$[0].distanciaMetros").value(org.hamcrest.Matchers.lessThan(100)));

        // 3) Apoiar e remover apoio
        mvc.perform(post("/api/demandas/" + id + "/apoio").session(cidadao).with(csrf()))
                .andExpect(jsonPath("$.apoiada").value(true))
                .andExpect(jsonPath("$.totalApoios").value(1));
        mvc.perform(post("/api/demandas/" + id + "/apoio").session(cidadao).with(csrf()))
                .andExpect(jsonPath("$.apoiada").value(false))
                .andExpect(jsonPath("$.totalApoios").value(0));

        // 4) Comentário
        mvc.perform(post("/api/demandas/" + id + "/comentarios").session(cidadao).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"texto\":\"Continua apagado.\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.oficial").value(false));

        // 5) Cidadão NÃO pode mudar status
        mvc.perform(patch("/api/demandas/" + id + "/status").session(cidadao).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"RESOLVIDA\"}"))
                .andExpect(status().isForbidden());

        // 6) Admin muda status: vai para a linha do tempo
        MockHttpSession admin = login("admin@brasiliaparticipa.df.gov.br", "admin123");
        mvc.perform(patch("/api/demandas/" + id + "/status").session(admin).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"RESOLVIDA\",\"observacao\":\"Lâmpada trocada.\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.demanda.status").value("RESOLVIDA"))
                .andExpect(jsonPath("$.historico.length()").value(2))
                .andExpect(jsonPath("$.historico[1].observacao").value("Lâmpada trocada."));

        // 7) Perfil com conquistas
        mvc.perform(get("/api/perfil").session(cidadao))
                .andExpect(jsonPath("$.demandasCriadas").value(1))
                .andExpect(jsonPath("$.demandasResolvidas").value(1))
                .andExpect(jsonPath("$.conquistas[0].conquistada").value(true));

        mvc.perform(get("/api/demandas").param("minhas", "true").session(cidadao))
                .andExpect(jsonPath("$.total").value(1));

        // 8) Admin exclui (a foto do GridFS vai junto)
        mvc.perform(delete("/api/demandas/" + id).session(admin).with(csrf()))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/demandas/" + id)).andExpect(status().isNotFound());
        mvc.perform(get(fotoUrl)).andExpect(status().isNotFound());
    }

    @Test
    void validacoesAoCriarDemanda() throws Exception {
        MockHttpSession cidadao = login("cidadao@email.com", "cidadao123");

        // Ponto fora do DF
        mvc.perform(multipart("/api/demandas").file(dadosDemanda("Fora do mapa", -23.55, -46.63))
                        .session(cidadao).with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem").value(org.hamcrest.Matchers.containsString("Distrito Federal")));

        // Arquivo que não é imagem
        MockMultipartFile falsa = new MockMultipartFile("foto", "virus.png", "image/png",
                "isto não é uma imagem".getBytes(StandardCharsets.UTF_8));
        mvc.perform(multipart("/api/demandas").file(dadosDemanda("Foto falsa", -16.01, -48.06)).file(falsa)
                        .session(cidadao).with(csrf()))
                .andExpect(status().isBadRequest());

        // Título vazio
        mvc.perform(multipart("/api/demandas").file(dadosDemanda("", -16.01, -48.06))
                        .session(cidadao).with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.titulo").exists());
    }

    @Test
    void logoutEncerraASessao() throws Exception {
        MockHttpSession sessao = login("cidadao@email.com", "cidadao123");
        mvc.perform(post("/api/auth/logout").session(sessao).with(csrf()))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/auth/sessao").session(sessao))
                .andExpect(jsonPath("$.logado").value(false));
    }

    @Test
    void paginasDoSiteSaoServidas() throws Exception {
        mvc.perform(get("/index.html")).andExpect(status().isOk());
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk());
    }
}
