isdefined(@__MODULE__, :_helpers_loaded) || include(joinpath(@__DIR__, "..", "helpers.jl"))

"""
Examples from the docs page reference/CoordinateChanges #transform
"""
function ref_coordinate_changes_transform()
    @ex result begin
        # A radial vector field is (r, 0) in polar coordinates
        @variables x y
        polar = (sqrt(x^2 + y^2), atan(y, x))

        X = Tensor([x, y])
        transform(X, (x, y), polar, simple=true)
        # Docs output:
        #   (1, 0)-Tensor
        #   Num[sqrt(x^2 + y^2), 0]
    end
    @ex result begin
        # The Euclidean metric in polar coordinates, at each point (x, y)
        g = Tensor([1 0; 0 1], :co, :co)
        transform(g, (x, y), polar, simple=true)
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[1 0; 0 x^2 + y^2]
    end
    @ex result begin
        # Written in the new coordinates u = x + y, v = x - y
        @variables u v
        shear = (x + y, x - y)
        back = ((u + v) / 2, (u - v) / 2)

        transform(g, (x, y), shear, to=(u, v), inverse=back, simple=true)
        # Docs output:
        #   (0, 2)-Tensor
        #   Num[1//2 0; 0 1//2]
    end
    @ex result begin
        # Covectors use the inverse Jacobian: dx = (du + dv) / 2
        dx = Tensor([1, 0]')
        transform(dx, (x, y), shear, to=(u, v), inverse=back, simple=true)
        # Docs output:
        #   (0, 1)-Tensor
        #   Num[1//2, 1//2]
    end
    @ex result begin
        # The trace and determinant of a (1, 1)-tensor are the same in every chart
        L = Tensor([2 -1; 5 3])
        Lp = transform(L, (x, y), shear, simple=true)
        tr(Lp), det(Lp)
        # Docs output:
        #   (5, 11)
    end
    @throws begin
        # The new coordinates must match the old ones in number
        transform(X, (x, y), (x, y, x))
        # Docs output:
        #   ERROR: A coordinate change needs as many new coordinates as old ones, but there are 2 old and 3 new
    end
end

"""
Examples from the docs page reference/CoordinateChanges #transform-basis
"""
function ref_coordinate_changes_transform_basis()
    @ex result begin
        # The Cartesian basis in the sheared coordinates
        @variables x y
        shear = (x + y, x - y)
        e = Basis([Tensor([1, 0]), Tensor([0, 1])])
        transform(e, (x, y), shear, simple=true)
        # Docs output:
        #   (1, 0)-Basis
        #   Num[1//2, 1//2]
        #   Num[1//2, -1//2]
    end
end
