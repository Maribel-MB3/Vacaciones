import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Vacation Coverage Analysis Endpoint
  app.post('/api/ai-analyze', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY no está configurada.',
          suggestion: 'Por favor añade GEMINI_API_KEY en las variables de entorno o panel de secretos.'
        });
      }

      const { vacations, employees } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Eres un asistente experto de gestión de Recursos Humanos y planificación de equipos.
Analiza la lista de vacaciones del equipo proporcionada y genera un informe estructurado y útil en castellano/español.

Datos del equipo y vacaciones:
- Empleados: ${JSON.stringify(employees, null, 2)}
- Solicitudes de Vacaciones: ${JSON.stringify(vacations, null, 2)}

Tu análisis debe incluir brevemente:
1. **Resumen de Cobertura y Picos**: ¿Hay departamentos o periodos con alto riesgo de falta de personal?
2. **Alertas de Solapamiento**: Identifica si 2 o más miembros de un mismo departamento están fuera simultáneamente.
3. **Solicitudes Pendientes**: Recomendación sobre cuáles deberían aprobarse o revisarse prioritariamente.
4. **Sugerencias y Consejos de Rotación**: 2 o 3 recomendaciones para mantener la continuidad operativa.

Mantiene un tono profesional, claro y conciso. Usa formato Markdown.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || 'No se pudo generar el análisis.';
      res.json({ result: text });
    } catch (error: any) {
      console.error('Error en /api/ai-analyze:', error);
      res.status(500).json({ error: error?.message || 'Error al procesar la solicitud con IA.' });
    }
  });

  // Vite middleware setup for development vs production static serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de Vacaciones iniciado en http://localhost:${PORT}`);
  });
}

startServer();
