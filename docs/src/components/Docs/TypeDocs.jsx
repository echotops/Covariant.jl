import CodeSimple from '../Code/CodeSimple';
import CodeInline from '../Code/CodeInline';
import style from './docs.module.css'

export default function TypeDocs({ id, name, code, description, fields=[], children }) {
    return (
        <div className={style.docs} id={id}>
            <p className="learn-title">{name}</p>
            <CodeSimple lang="julia" code={code} />
            <p className="learn-body">{description}</p>
            {fields.length != 0 && <p className="learn-heading">Fields</p>}
            {fields.map((item) => (
                <div key={item[0]} className={style.attribute}>
                    <p className={style.title}>{item[0]}<CodeInline code={item[1]}></CodeInline></p>
                    <p className="learn-body">{item[2]}</p>
                </div>
            ))}
            {children}
        </div>
    );
}
