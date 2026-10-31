package br.com.brasiliaparticipa.service;

import br.com.brasiliaparticipa.exception.RecursoNaoEncontradoException;
import br.com.brasiliaparticipa.exception.RegraNegocioException;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;

/**
 * Guarda as fotos das demandas dentro do próprio MongoDB usando o GridFS
 * (o Mongo divide o arquivo em pedaços nas coleções fs.files e fs.chunks).
 * Assim não precisamos de uma pasta de uploads no servidor.
 */
@Service
public class FotoService {

    private static final String PREFIXO_URL = "/api/fotos/";

    private final GridFsTemplate gridFs;

    public FotoService(GridFsTemplate gridFs) {
        this.gridFs = gridFs;
    }

    /** Salva a foto e devolve a URL pública dela (/api/fotos/{id}). */
    public String salvar(MultipartFile arquivo) {
        try {
            byte[] bytes = arquivo.getBytes();
            String tipo = detectarTipoImagem(bytes);
            if (tipo == null) {
                throw new RegraNegocioException("Envie uma imagem JPG, PNG, WEBP ou GIF.");
            }
            ObjectId id = gridFs.store(new ByteArrayInputStream(bytes), arquivo.getOriginalFilename(), tipo,
                    new Document("tipo", "foto-demanda"));
            return PREFIXO_URL + id.toHexString();
        } catch (IOException e) {
            throw new RegraNegocioException("Não foi possível ler a foto enviada.");
        }
    }

    public GridFsResource buscar(String id) {
        if (!ObjectId.isValid(id)) {
            throw new RecursoNaoEncontradoException("Foto não encontrada.");
        }
        GridFSFile arquivo = gridFs.findOne(Query.query(Criteria.where("_id").is(new ObjectId(id))));
        if (arquivo == null) {
            throw new RecursoNaoEncontradoException("Foto não encontrada.");
        }
        return gridFs.getResource(arquivo);
    }

    /** Apaga do GridFS a foto enviada pelo cidadão (fotos de exemplo em /imagens não são tocadas). */
    public void excluirSeEnviada(String fotoUrl) {
        if (fotoUrl == null || !fotoUrl.startsWith(PREFIXO_URL)) return;
        String id = fotoUrl.substring(PREFIXO_URL.length());
        if (ObjectId.isValid(id)) {
            gridFs.delete(Query.query(Criteria.where("_id").is(new ObjectId(id))));
        }
    }

    /**
     * Confere os primeiros bytes do arquivo (a "assinatura") em vez de confiar
     * só na extensão ou no tipo que o navegador informou.
     */
    static String detectarTipoImagem(byte[] b) {
        if (b.length < 12) return null;
        if ((b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) return "image/jpeg";
        if ((b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G') return "image/png";
        if (b[0] == 'G' && b[1] == 'I' && b[2] == 'F' && b[3] == '8') return "image/gif";
        if (Arrays.equals(Arrays.copyOfRange(b, 0, 4), "RIFF".getBytes())
                && Arrays.equals(Arrays.copyOfRange(b, 8, 12), "WEBP".getBytes())) return "image/webp";
        return null;
    }
}
