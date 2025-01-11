'use server'

import { z } from "zod";

const schema = z.object({
    id: z.union([z.coerce.number(), z.string().nullish()]),
    nombre: z.string().trim()
        .min(2, "Al menos debe tener dos letras, introduzca correctamente el nombre")
        .max(8, "Como máximo solo pueden haber 8 letras"),
    edad: z.coerce.number()
        .min(18, "La edad mínima debe ser 18 años")
        .max(70, "La edad máxima debe ser 70 años"),
    telefono: z.string().trim()
        .regex(/^[623][0-9]{9}$/, "Escribe 10 dígitos, siendo el primero 6,2 u 3"),
    email: z.string().email({ message: "Email no válido, introduzca un email real" }),
    fecha: z.coerce.date()
        .min(new Date("2020-01-01"), "La fecha debe estar dentro del año 2020")
        .max(new Date("2025-12-31"), "La fecha debe estar dentro del año 2025"),
    comentario: z.string().optional()
})

function validate(formData) {
    const datos = Object.fromEntries(formData.entries())

    const result = schema.safeParse(datos)
    return result
    // https://zod.dev/ERROR_HANDLING?id=zodparsedtype
    // result puede ser de 2 tipos:
    // { success: true, data: z.infer<typeof schema> } 
    // { success: false, error: issues[] }  
}

export async function realAction(prevState, formData) {
    // How to (not) reset a form after a Server Action in React:
    // https://www.robinwieruch.de/react-server-action-reset-form/

    const result = validate(formData)
    if (!result.success) {
        const simplified = result.error.issues.map(issue => [issue.path[0], issue.message])
        const issues = Object.fromEntries(simplified)
        return { issues, payload: formData }
    }


    try {
        // Hacemos algo (guardar en BD, enviar a API, ...) con
        // result.data
        console.log(result.data);
        return { success: 'Éxito al realizar acción' }
    } catch (error) {
        console.log("Error:", error);
        return { error }
    }
}